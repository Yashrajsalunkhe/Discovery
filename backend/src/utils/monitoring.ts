export interface MetricData {
  name: string;
  value: number;
  timestamp: Date;
  tags?: Record<string, string>;
}

class SimpleMetrics {
  private metrics: MetricData[] = [];
  private maxEntries = 1000; // Keep last 1000 metrics

  increment(name: string, tags?: Record<string, string>) {
    this.record(name, 1, tags);
  }

  record(name: string, value: number, tags?: Record<string, string>) {
    this.metrics.push({
      name,
      value,
      timestamp: new Date(),
      tags
    });

    // Keep only recent metrics
    if (this.metrics.length > this.maxEntries) {
      this.metrics.shift();
    }
  }

  getMetrics(name?: string, since?: Date): MetricData[] {
    let filtered = this.metrics;

    if (name) {
      filtered = filtered.filter(m => m.name === name);
    }

    if (since) {
      filtered = filtered.filter(m => m.timestamp >= since);
    }

    return filtered;
  }

  getStats(name: string, since?: Date) {
    const metrics = this.getMetrics(name, since);
    if (metrics.length === 0) return null;

    const values = metrics.map(m => m.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      count: metrics.length,
      sum,
      avg,
      min,
      max,
      latest: values[values.length - 1]
    };
  }

  clear() {
    this.metrics = [];
  }
}

export const metrics = new SimpleMetrics();

// Middleware to track request metrics
export const metricsMiddleware = (req: any, res: any, next: any) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    metrics.record('request_duration', duration, {
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode.toString()
    });
    
    metrics.increment('requests_total', {
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode.toString()
    });
  });
  
  next();
};

// Log critical events
export const logCritical = (message: string, data?: any) => {
  const logEntry = {
    level: 'CRITICAL',
    message,
    data,
    timestamp: new Date().toISOString(),
    server: 'discovery-backend'
  };
  
  console.error('CRITICAL:', JSON.stringify(logEntry));
  metrics.increment('critical_errors');
};

export const logRegistrationEvent = (event: string, registrationId?: number, error?: Error) => {
  const logEntry = {
    level: 'INFO',
    event,
    registrationId,
    error: error ? {
      message: error.message,
      stack: error.stack
    } : undefined,
    timestamp: new Date().toISOString()
  };
  
  console.log('REGISTRATION EVENT:', JSON.stringify(logEntry));
  metrics.increment('registration_events', { event });
  
  if (error) {
    metrics.increment('registration_errors', { event });
  }
};