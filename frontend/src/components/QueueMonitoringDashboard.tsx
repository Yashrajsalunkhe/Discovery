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

      // Fetch items if admin
      const itemsResponse = await fetch(`/api/admin/queue?status=${selectedStatus === 'all' ? '' : selectedStatus}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
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
      await fetch('/api/queue/process', { method: 'POST' });
      setTimeout(fetchData, 2000); // Refresh after 2 seconds
    } catch (error) {
      console.error('Failed to trigger processing:', error);
    }
  };

  const retryItem = async (id: string) => {
    try {
      await fetch(`/api/admin/queue/${id}/retry`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      fetchData();
    } catch (error) {
      console.error('Failed to retry item:', error);
    }
  };

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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.processing || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.completed || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.failed || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex gap-4 items-center">
        <select 
          value={selectedStatus} 
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
        
        <Button onClick={triggerProcessing} disabled={isLoading}>
          Process Queue Now
        </Button>
        
        <Button onClick={fetchData} variant="outline" disabled={isLoading}>
          Refresh
        </Button>
      </div>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Queue Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Payment ID</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Event</th>
                  <th className="text-left p-2">Attempts</th>
                  <th className="text-left p-2">Age</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="p-2 font-mono text-xs">{item.paymentId.slice(-8)}</td>
                    <td className="p-2">
                      <Badge variant={getStatusBadgeVariant(item.status)}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{item.registrationData.leaderName}</div>
                        <div className="text-gray-500 text-xs">{item.registrationData.leaderEmail}</div>
                      </div>
                    </td>
                    <td className="p-2">{item.registrationData.selectedEvent}</td>
                    <td className="p-2">{item.attempts}</td>
                    <td className="p-2">{formatAge(item.createdAt)}</td>
                    <td className="p-2">
                      {item.status === 'failed' && (
                        <Button size="sm" onClick={() => retryItem(item._id)}>
                          Retry
                        </Button>
                      )}
                      {item.errorMessage && (
                        <div className="text-xs text-red-500 mt-1 max-w-48 truncate" title={item.errorMessage}>
                          {item.errorMessage}
                        </div>
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