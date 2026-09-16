import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface QueueStats {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  total: number;
  oldestPendingAge: number;
}

interface QueueItem {
  _id: string;
  paymentId: string;
  orderId: string;
  status: string;
  attempts: number;
  createdAt: string;
  lastAttemptAt?: string;
  errorMessage?: string;
  registrationData: {
    leaderEmail: string;
    leaderName: string;
    selectedEvent: string;
  };
}

const QueueMonitoringDashboard: React.FC = () => {
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [items, setItems] = useState<QueueItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch stats
      const statsResponse = await fetch('/api/queue/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch items from public endpoint (no admin auth required)
      const itemsResponse = await fetch(`/api/queue/details?status=${selectedStatus === 'all' ? '' : selectedStatus}`);
      
      if (itemsResponse.ok) {
        const itemsData = await itemsResponse.json();
        setItems(itemsData.items);
      }
      
    } catch (error) {
      console.error('Failed to fetch queue data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus]);

  const triggerProcessing = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/queue/process', { method: 'POST' });
      const result = await response.json();
      
      if (response.ok) {
        console.log('Queue processing completed:', result);
        
        // Show processing results if any items were processed
        if (result.processed && (result.processed.pending > 0 || result.processed.failed > 0)) {
          alert(`Queue processing completed!\n\nProcessed items:\n- Pending: ${result.processed.pending}\n- Failed retries: ${result.processed.failed}`);
        } else {
          alert('Queue processing completed successfully!\nNo items required processing.');
        }
        
        // Refresh data immediately after successful processing
        await fetchData();
      } else {
        console.error('Queue processing failed:', result.error);
        alert(`Processing failed: ${result.message || result.error}`);
      }
    } catch (error) {
      console.error('Failed to trigger processing:', error);
      alert('Failed to trigger queue processing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Retry functionality removed for public access
  // Admin retry is available in the admin panel

  const getStatusBadgeVariant = (status: string): "destructive" | "default" | "outline" | "secondary" => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'processing': return 'outline';
      case 'failed': return 'destructive';
      default: return 'default';
    }
  };

  const formatAge = (timestamp: string) => {
    const age = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(age / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-slate-200 bg-white shadow-xs rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-amber-600">{stats?.pending || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 bg-white shadow-xs rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-blue-600">{stats?.processing || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 bg-white shadow-xs rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-emerald-600">{stats?.completed || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 bg-white shadow-xs rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-rose-600">{stats?.failed || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 bg-white shadow-xs rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-900">{stats?.total || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex gap-4 items-center flex-wrap">
        <select 
          value={selectedStatus} 
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-slate-300 rounded-xl px-4 py-2 bg-white text-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
        
        <Button onClick={triggerProcessing} disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl px-5">
          {isLoading ? 'Processing...' : 'Process Queue Now'}
        </Button>
        
        <Button onClick={fetchData} variant="outline" disabled={isLoading} className="border-slate-300 text-slate-700 rounded-xl">
          Refresh
        </Button>
      </div>

      {/* Items Table */}
      <Card className="border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/60 p-5">
          <CardTitle className="text-lg font-bold text-slate-900">Queue Items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold">
                  <th className="text-left p-3.5 pl-5">Payment ID</th>
                  <th className="text-left p-3.5">Status</th>
                  <th className="text-left p-3.5">User</th>
                  <th className="text-left p-3.5">Event</th>
                  <th className="text-left p-3.5">Attempts</th>
                  <th className="text-left p-3.5">Age</th>
                  <th className="text-left p-3.5 pr-5">Error Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-3.5 pl-5 font-mono text-xs font-semibold text-slate-600">{item.paymentId.slice(-8)}</td>
                    <td className="p-3.5">
                      <Badge variant={getStatusBadgeVariant(item.status)}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-3.5">
                      <div>
                        <div className="font-semibold text-slate-900">{item.registrationData.leaderName}</div>
                        <div className="text-slate-500 text-xs">{item.registrationData.leaderEmail}</div>
                      </div>
                    </td>
                    <td className="p-3.5 font-medium">{item.registrationData.selectedEvent}</td>
                    <td className="p-3.5 font-mono text-xs">{item.attempts}</td>
                    <td className="p-3.5 text-slate-500 text-xs font-mono">{formatAge(item.createdAt)}</td>
                    <td className="p-3.5 pr-5">
                      {item.errorMessage && (
                        <div className="text-xs text-rose-600 mt-1 max-w-48 truncate" title={item.errorMessage}>
                          {item.errorMessage}
                        </div>
                      )}
                      {item.status === 'failed' && !item.errorMessage && (
                        <div className="text-xs text-rose-600 font-semibold">Failed</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QueueMonitoringDashboard;