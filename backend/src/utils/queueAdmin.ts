import { Request, Response } from 'express';
import { PendingRegistration, getQueueStats } from './guaranteedQueue.js';

/**
 * Get detailed queue information for admin panel
 */
export const getQueueDetails = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const status = req.query.status as string;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};
    if (status && ['pending', 'processing', 'completed', 'failed'].includes(status)) {
      filter.status = status;
    }

    // Get items with pagination
    const items = await PendingRegistration.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select({
        paymentId: 1,
        orderId: 1,
        status: 1,
        attempts: 1,
        createdAt: 1,
        lastAttemptAt: 1,
        completedAt: 1,
        errorMessage: 1,
        'registrationData.leaderEmail': 1,
        'registrationData.leaderName': 1,
        'registrationData.selectedEvent': 1
      });

    const total = await PendingRegistration.countDocuments(filter);
    const stats = await getQueueStats();

    res.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats
    });

  } catch (error) {
    console.error('Queue details error:', error);
    res.status(500).json({ error: 'Failed to get queue details' });
  }
};

/**
 * Retry a specific failed item
 */
export const retryQueueItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await PendingRegistration.updateOne(
      { 
        _id: id,
        status: { $in: ['failed', 'processing'] }
      },
      {
        $set: {
          status: 'pending',
          attempts: 0,
          errorMessage: undefined,
          processingBy: undefined,
          lockExpiresAt: undefined
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Item not found or cannot be retried' });
    }

    // Trigger processing
    const { processGuaranteedQueue } = await import('./guaranteedQueue.js');
    processGuaranteedQueue(`admin_retry_${Date.now()}`).catch(err => {
      console.error('Admin retry processing error:', err);
    });

    res.json({ success: true, message: 'Item queued for retry' });

  } catch (error) {
    console.error('Retry queue item error:', error);
    res.status(500).json({ error: 'Failed to retry item' });
  }
};

/**
 * Get processing statistics
 */
export const getProcessingStats = async (req: Request, res: Response) => {
  try {
    const hours = parseInt(req.query.hours as string) || 24;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const stats = await PendingRegistration.aggregate([
      {
        $match: {
          createdAt: { $gte: since }
        }
      },
      {
        $group: {
          _id: {
            status: '$status',
            hour: { $hour: '$createdAt' }
          },
          count: { $sum: 1 },
          avgAttempts: { $avg: '$attempts' }
        }
      },
      {
        $sort: { '_id.hour': 1 }
      }
    ]);

    // Get average processing time for completed items
    const processingTimes = await PendingRegistration.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: since },
          completedAt: { $exists: true }
        }
      },
      {
        $project: {
          processingTime: {
            $subtract: ['$completedAt', '$createdAt']
          }
        }
      },
      {
        $group: {
          _id: null,
          avgProcessingTime: { $avg: '$processingTime' },
          minProcessingTime: { $min: '$processingTime' },
          maxProcessingTime: { $max: '$processingTime' }
        }
      }
    ]);

    res.json({
      hourlyStats: stats,
      processingTimes: processingTimes[0] || {
        avgProcessingTime: 0,
        minProcessingTime: 0,
        maxProcessingTime: 0
      }
    });

  } catch (error) {
    console.error('Processing stats error:', error);
    res.status(500).json({ error: 'Failed to get processing stats' });
  }
};