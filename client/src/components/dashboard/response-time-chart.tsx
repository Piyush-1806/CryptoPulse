import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ResponseTimeData {
  timestamp: string;
  value: number;
}

export function ResponseTimeChart() {
  const [timeframe, setTimeframe] = useState('24h');
  const [data, setData] = useState<ResponseTimeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would fetch time series data from the API
        // For this example, we'll generate mock data based on the metrics endpoint
        const response = await apiRequest('GET', '/api/v1/metrics');
        const metricsData = await response.json();
        
        const avgResponseTime = metricsData.data.avg_response_time || 50;
        
        // Generate sample data for demonstration
        const mockData: ResponseTimeData[] = [];
        const now = new Date();
        let points = 24;
        
        if (timeframe === '7d') points = 7;
        if (timeframe === '30d') points = 30;
        
        for (let i = points - 1; i >= 0; i--) {
          const timestamp = new Date(now);
          
          if (timeframe === '24h') {
            timestamp.setHours(now.getHours() - i);
          } else if (timeframe === '7d') {
            timestamp.setDate(now.getDate() - i);
          } else if (timeframe === '30d') {
            timestamp.setDate(now.getDate() - i);
          }
          
          // Randomize response time around the average
          const randomFactor = 0.3; // 30% variation
          const minValue = avgResponseTime * (1 - randomFactor);
          const maxValue = avgResponseTime * (1 + randomFactor);
          const value = Math.floor(minValue + Math.random() * (maxValue - minValue));
          
          mockData.push({
            timestamp: timestamp.toISOString(),
            value
          });
        }
        
        setData(mockData);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch response time data');
        setIsLoading(false);
      }
    };

    fetchData();
    // Update every minute
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [timeframe]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (timeframe === '24h') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (isLoading) {
    return (
      <Card className="md:col-span-2 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Response Time (ms)</h3>
          <div className="animate-pulse bg-slate-700 w-32 h-8 rounded"></div>
        </div>
        <div className="h-64 bg-slate-900 rounded animate-pulse"></div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="md:col-span-2 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Response Time (ms)</h3>
          <div>
            <select 
              className="bg-slate-700 text-slate-300 rounded px-2 py-1 text-sm border border-slate-600"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>
        </div>
        <div className="bg-red-900/20 border border-red-900 text-red-200 p-4 rounded">
          {error}
        </div>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-2 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Response Time (ms)</h3>
        <div>
          <select 
            className="bg-slate-700 text-slate-300 rounded px-2 py-1 text-sm border border-slate-600"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>
      <div className="h-64 bg-slate-900 rounded overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTimestamp}
              tick={{ fill: '#94A3B8', fontSize: 10 }}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis 
              unit=" ms"
              tick={{ fill: '#94A3B8', fontSize: 10 }}
              axisLine={{ stroke: '#334155' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '0.375rem' }}
              labelFormatter={formatTimestamp}
              formatter={(value) => [`${value} ms`, 'Response Time']}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              fillOpacity={1} 
              fill="url(#colorResponse)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
