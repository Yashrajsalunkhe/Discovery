import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { registerUser, connectToMongoDB } from './register.js';
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
app.use(express.json({ limit: '10mb' }));
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

// Admin Routes
app.post('/api/admin/login', adminLogin);
app.get('/api/admin/registrations', authenticateAdmin, getAllRegistrations);
app.get('/api/admin/export', authenticateAdmin, exportRegistrationsExcel);
app.get('/api/admin/stats', authenticateAdmin, getRegistrationStats);

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

app.post('/api/queue/process', async (req, res) => {
  try {
    console.log('Manual queue processing triggered');
    processGuaranteedQueue(`manual_${Date.now()}`).catch(err => {
      console.error('Manual processing error:', err);
    });
    res.json({ success: true, message: 'Queue processing started' });
  } catch (error) {
    console.error('Queue process trigger error:', error);
    res.status(500).json({ error: 'Failed to start queue processing' });
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