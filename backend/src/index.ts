import dotenv from 'dotenv';
import express from 'express';
import type { Request } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { registerUser, connectToMongoDB, Registration } from './register.js';
import { checkDuplicate } from './search.js';
import { orderRazorpay } from './utils/razorpay.js';
import { verifyPayment } from './utils/payment-verification.js';
import { deduplicationMiddleware } from './utils/deduplication.js';
import { registrationRateLimit } from './utils/rateLimit.js';
import { metricsMiddleware, metrics } from './utils/monitoring.js';
import { processGuaranteedQueue, getQueueStats } from './utils/guaranteedQueue.js';
import { initializeCounterSafely } from './utils/atomicCounter.js';
import { 
  adminLogin, 
  authenticateAdmin, 
  getAllRegistrations, 
  exportRegistrationsExcel, 
  getRegistrationStats 
} from './utils/admin.js';
import { getQueueDetails, retryQueueItem, getProcessingStats } from './utils/queueAdmin.js';
import { razorpayWebhook } from './utils/webhook.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Disable buffering globally to prevent timeout issues in serverless
mongoose.set('bufferCommands', false);

const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow vercel domains
    if (origin.includes('vercel.app') || origin.includes('vercel.com')) {
      return callback(null, true);
    }
    
    // Add your production domain here
    const allowedDomains = [
      'https://discovery-adcet.vercel.app',
      'https://discovery-rouge.vercel.app',
      'https://discovery.adcet.ac.in'
      // Add more domains as needed
    ];
    
    if (allowedDomains.some(domain => origin.startsWith(domain))) {
      return callback(null, true);
    }
    
    // Default allow in production
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({
  limit: '10mb',
  verify: (req, _res, buffer) => {
    if ((req as Request).originalUrl === '/api/razorpay/webhook') {
      (req as Request & { rawBody?: Buffer }).rawBody = Buffer.from(buffer);
    }
  }
}));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(metricsMiddleware);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Request headers:', req.headers);
  console.log('Request origin:', req.get('Origin') || 'No origin');
  next();
});

// Additional OPTIONS handling for CORS preflight
app.options('*', cors(corsOptions));

// MongoDB connection middleware - ensure connection before any DB operations
app.use(async (req, res, next) => {
  // Only initialize connection for API routes that need database
  if (req.path.startsWith('/api/') && req.path !== '/api/health') {
    try {
      await connectToMongoDB();
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      return res.status(503).json({ 
        success: false, 
        error: 'Database connection failed',
        message: 'Service temporarily unavailable. Please try again in a moment.'
      });
    }
  }
  next();
});

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'Discovery ADCET Backend Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Initialize counter safely on first registration request (only runs once)
let counterInitialized = false;
app.use(async (req, res, next) => {
  if (!counterInitialized && req.path.includes('/api/register')) {
    try {
      await initializeCounterSafely();
      counterInitialized = true;
    } catch (error) {
      console.error('Counter initialization error:', error);
      // Continue anyway - system has fallbacks
    }
  }
  next();
});

// API Routes
app.post('/api/register', registrationRateLimit, deduplicationMiddleware, checkDuplicate, verifyPayment, registerUser);
app.post('/api/order', orderRazorpay);
app.post('/api/payment-verification', verifyPayment);
app.post('/api/razorpay/webhook', razorpayWebhook);

// Registration Status Lookup (public — no admin auth)
app.get('/api/registration/status', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string' || query.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid search query (minimum 3 characters).',
      });
    }

    const searchTerm = query.trim();

    // Build search conditions: registration ID (numeric), email, or mobile
    const conditions: any[] = [];

    // Check if the query is a numeric registration ID
    const numericId = parseInt(searchTerm, 10);
    if (!isNaN(numericId) && String(numericId) === searchTerm) {
      conditions.push({ registrationId: numericId });
    }

    // Always try email and mobile matches (case-insensitive)
    conditions.push({ leaderEmail: { $regex: `^${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } });
    conditions.push({ leaderMobile: searchTerm });

    const registrations = await Registration.find(
      { $or: conditions }
    )
      .select('registrationId leaderName leaderEmail leaderMobile leaderCollege selectedEvent participationType teamSize teamMembers totalFee createdAt -_id')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Strip sensitive fields from team members (only expose name & college)
    const sanitized = registrations.map((reg: any) => ({
      ...reg,
      teamMembers: (reg.teamMembers || []).map((m: any) => ({
        name: m.name,
        college: m.college,
      })),
    }));

    if (sanitized.length === 0) {
      return res.json({
        success: true,
        found: false,
        data: [],
        message: 'No registrations found matching your query.',
      });
    }

    return res.json({
      success: true,
      found: true,
      data: sanitized,
    });
  } catch (error) {
    console.error('Registration status lookup error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to look up registration status. Please try again.',
    });
  }
});

// Admin Routes
app.post('/api/admin/login', adminLogin);
app.get('/api/admin/registrations', authenticateAdmin, getAllRegistrations);
app.get('/api/admin/export', authenticateAdmin, exportRegistrationsExcel);
app.get('/api/admin/stats', authenticateAdmin, getRegistrationStats);

// Admin: Resend confirmation emails for existing registrations
app.post('/api/admin/resend-emails', authenticateAdmin, async (req, res) => {
  try {
    const { registrationIds } = req.body as { registrationIds?: number[] };

    if (!registrationIds || !Array.isArray(registrationIds) || registrationIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Provide registrationIds as an array of numbers, e.g. { "registrationIds": [1010, 1011, 1012] }',
      });
    }

    await connectToMongoDB();
    const registrations = await Registration.find({
      registrationId: { $in: registrationIds },
    }).lean();

    if (registrations.length === 0) {
      return res.json({ success: false, error: 'No registrations found for the given IDs.' });
    }

    const { sendWelcomeEmail } = await import('./utils/mail.js');

    const results: { id: number; email: string; status: string; error?: string }[] = [];

    for (const reg of registrations) {
      try {
        await sendWelcomeEmail(
          reg.leaderEmail,
          reg.registrationId.toString(),
          reg.leaderName,
          reg.leaderYear,
          reg.leaderMobile,
          reg.selectedEvent,
          reg.leaderCollege,
          {
            leaderDepartment: reg.leaderDepartment,
            leaderCity: reg.leaderCity,
            participationType: reg.participationType,
            teamSize: reg.teamSize,
            teamMembers: reg.teamMembers,
            paymentId: reg.paymentId,
            orderId: reg.orderId,
            totalFee: reg.totalFee,
            paperPresentationDept: reg.paperPresentationDept,
            createdAt: reg.createdAt,
          }
        );
        results.push({ id: reg.registrationId, email: reg.leaderEmail, status: 'sent' });
        console.log(`✅ Resent email for #${reg.registrationId} to ${reg.leaderEmail}`);
      } catch (emailError: any) {
        results.push({ id: reg.registrationId, email: reg.leaderEmail, status: 'failed', error: emailError.message });
        console.error(`❌ Resend failed for #${reg.registrationId}:`, emailError.message);
      }
    }

    const sent = results.filter(r => r.status === 'sent').length;
    const failed = results.filter(r => r.status === 'failed').length;

    return res.json({
      success: true,
      message: `Resent ${sent}/${registrations.length} emails (${failed} failed)`,
      results,
    });
  } catch (error: any) {
    console.error('Resend emails error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Queue Management Routes
app.get('/api/admin/queue', authenticateAdmin, getQueueDetails);
app.post('/api/admin/queue/:id/retry', authenticateAdmin, retryQueueItem);
app.get('/api/admin/queue/stats', authenticateAdmin, getProcessingStats);

// Monitoring Routes
app.get('/api/health', async (req, res) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: {
      status: 'unknown',
      connection: mongoose.connection.readyState,
      message: ''
    }
  };

  // Check database connectivity
  try {
    const { ensureMongoConnection, getConnectionStatus } = await import('./utils/mongoHealth.js');
    const isConnected = await ensureMongoConnection(2); // Quick check with 2 retries
    
    if (isConnected) {
      healthCheck.database.status = 'connected';
      healthCheck.database.message = `Connected (${getConnectionStatus()})`;
      
      // Quick database operation test
      try {
        await mongoose.connection.db?.admin().ping();
        healthCheck.database.message += ' - Ping successful';
      } catch (pingError) {
        healthCheck.database.status = 'degraded';
        healthCheck.database.message += ` - Ping failed: ${pingError}`;
      }
    } else {
      healthCheck.status = 'error';
      healthCheck.database.status = 'disconnected';
      healthCheck.database.message = `Disconnected (${getConnectionStatus()})`;
    }
  } catch (dbError) {
    healthCheck.status = 'error';
    healthCheck.database.status = 'error';
    healthCheck.database.message = `Database check failed: ${dbError}`;
  }

  // Set appropriate HTTP status
  const statusCode = healthCheck.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(healthCheck);
});

app.get('/api/metrics', (req, res) => {
  const since = req.query.since ? new Date(req.query.since as string) : undefined;
  res.json({
    requests: metrics.getStats('requests_total', since),
    duration: metrics.getStats('request_duration', since),
    registrations: metrics.getStats('registration_events', since),
    errors: metrics.getStats('registration_errors', since)
  });
});

// Queue Management Routes
app.get('/api/queue/stats', async (req, res) => {
  try {
    const stats = await getQueueStats();
    res.json(stats);
  } catch (error) {
    console.error('Queue stats error:', error);
    res.status(500).json({ error: 'Failed to get queue stats' });
  }
});

// Public Queue Details Route (no admin auth required)
app.get('/api/queue/details', async (req, res) => {
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

    // Import PendingRegistration model
    const { PendingRegistration } = await import('./utils/guaranteedQueue.js');

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
});

app.post('/api/queue/process', async (req, res) => {
  try {
    console.log('🚀 Manual queue processing triggered');
    
    // Ensure MongoDB connection before processing
    await connectToMongoDB();
    console.log('✅ MongoDB connection established for queue processing');
    
    // Get initial stats
    const initialStats = await getQueueStats();
    console.log('📊 Initial queue stats:', initialStats);
    
    // Process the queue and wait for completion to provide better feedback
    const instanceId = `manual_${Date.now()}`;
    console.log(`🔄 Starting queue processing with instance ID: ${instanceId}`);
    await processGuaranteedQueue(instanceId);
    
    // Get updated stats after processing
    const finalStats = await getQueueStats();
    console.log('📊 Final queue stats:', finalStats);
    
    console.log('✅ Manual queue processing completed successfully');
    res.json({ 
      success: true, 
      message: 'Queue processing completed successfully',
      initialStats,
      finalStats,
      processed: {
        pending: Math.max(0, initialStats.pending - finalStats.pending),
        failed: Math.max(0, initialStats.failed - finalStats.failed)
      }
    });
  } catch (error) {
    console.error('❌ Queue process trigger error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process queue',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Auto-process queue every 30 seconds (for Vercel, this runs when there's traffic)
// Only start auto-processing after ensuring connection
let autoProcessingStarted = false;
const startAutoProcessing = () => {
  if (autoProcessingStarted) return;
  autoProcessingStarted = true;
  
  setInterval(async () => {
    try {
      await connectToMongoDB();
      await processGuaranteedQueue();
    } catch (err) {
      console.error('Auto queue processing error:', err);
    }
  }, 30000);
};

// Start auto-processing on first successful database operation
app.use((req, res, next) => {
  if (req.path.startsWith('/api/') && req.path !== '/api/health') {
    startAutoProcessing();
  }
  next();
});

// GitHub Actions Cron Job endpoint for guaranteed queue processing
app.get('/api/cron/process-queue', async (req, res) => {
  try {
    console.log('GitHub Actions cron job triggered for queue processing');
    
    // Verify this is from GitHub Actions or authorized source
    const authHeader = req.headers.authorization;
    const userAgent = req.headers['user-agent'] || '';
    
    // In production, optionally verify the authorization token if CRON_SECRET is set
    if (process.env.NODE_ENV === 'production' && process.env.CRON_SECRET) {
      if (!authHeader?.startsWith('Bearer ') || authHeader.split(' ')[1] !== process.env.CRON_SECRET) {
        console.log('Unauthorized cron access attempt from:', req.ip, 'User-Agent:', userAgent);
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }
    
    // Log the request for monitoring
    console.log('Processing queue via GitHub Actions cron from:', req.ip, 'User-Agent:', userAgent);
    
    await processGuaranteedQueue(`github_actions_${Date.now()}`);
    const stats = await getQueueStats();
    
    console.log('GitHub Actions cron job completed. Queue stats:', stats);
    
    res.json({
      success: true,
      message: 'Queue processed by GitHub Actions',
      stats,
      timestamp: new Date().toISOString(),
      processor: 'github-actions'
    });
    
  } catch (error) {
    console.error('GitHub Actions cron job error:', error);
    res.status(500).json({ 
      error: 'Cron job failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {   
    console.log(`Discovery ADCET Backend Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}`);
  });
}

export default app;