import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { StatusCard } from '@/components/dashboard/status-card';
import { ResponseTimeChart } from '@/components/dashboard/response-time-chart';
import { PriceCard } from '@/components/crypto/price-card';
import { apiRequest } from '@/lib/queryClient';

interface Metrics {
  avg_response_time: number;
  cache_hit_rate: number;
  requests_per_second: number;
  error_rate: number;
  cache_stats?: {
    size: number;
    keys: string[];
  };
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest('GET', '/api/v1/metrics');
        const data = await response.json();
        if (data && data.data) {
          setMetrics(data.data);
        }
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch metrics data');
        setIsLoading(false);
      }
    };

    fetchMetrics();
    // Update metrics every 60 seconds
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppLayout>
      <div id="dashboard" className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Dashboard</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-lg shadow p-4 border border-slate-700 animate-pulse h-28" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-900 text-red-200 p-4 rounded mb-6">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatusCard
              title="API Status"
              value="Healthy"
              icon={
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              }
              iconBgColor="bg-green-100"
              change={{ value: "100% uptime", isPositive: true }}
              period="last 24h"
            />
            
            <StatusCard
              title="Avg. Response Time"
              value={`${metrics?.avg_response_time || 0}ms`}
              icon={
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              iconBgColor="bg-blue-100"
              change={{ value: "▼12ms", isPositive: true }}
              period="from last week"
            />
            
            <StatusCard
              title="Cache Hit Rate"
              value={`${(metrics?.cache_hit_rate || 0).toFixed(1)}%`}
              icon={
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              iconBgColor="bg-indigo-100"
              change={{ value: "▲2.1%", isPositive: true }}
              period="from last week"
            />
            
            <StatusCard
              title="API Requests"
              value={`${(metrics?.requests_per_second * 3600 * 24 / 1000000).toFixed(1)}M`}
              icon={
                <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
              iconBgColor="bg-amber-100"
              change={{ value: "▲8.7%", isPositive: true }}
              period="from last week"
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ResponseTimeChart />
          <PriceCard />
        </div>
      </div>
    </AppLayout>
  );
}
