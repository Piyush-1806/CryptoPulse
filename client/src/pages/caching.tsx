import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';

interface CacheStats {
  size: number;
  keys: string[];
}

interface CacheMetrics {
  cache_hit_rate: number;
  avg_response_time: number;
  cache_stats: CacheStats;
}

export default function Caching() {
  const [metrics, setMetrics] = useState<CacheMetrics | null>(null);
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
        setError('Failed to fetch caching metrics');
        setIsLoading(false);
      }
    };

    fetchMetrics();
    // Update metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppLayout>
      <div id="caching" className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Caching System</h2>
        
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">Redis Implementation</h3>
            <p className="text-slate-300">The caching layer is built on Redis to optimize data retrieval and minimize external API calls.</p>
          </div>
          
          {/* Caching Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium text-white mb-4">Cache Strategy</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-red-500 rounded-full p-1 mr-3 mt-1">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-white">Time-based Expiration</h5>
                    <p className="text-xs text-slate-400">Data is cached with varying TTL based on volatility and importance</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-red-500 rounded-full p-1 mr-3 mt-1">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-white">Cache Warming</h5>
                    <p className="text-xs text-slate-400">Background job pre-caches popular crypto data every minute</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-red-500 rounded-full p-1 mr-3 mt-1">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-white">Distributed Caching</h5>
                    <p className="text-xs text-slate-400">Redis cluster for high availability and performance</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-red-500 rounded-full p-1 mr-3 mt-1">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-white">Conditional Invalidation</h5>
                    <p className="text-xs text-slate-400">Cache entries are invalidated when price changes significantly</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cache Hit/Miss Diagram */}
            <div>
              <h4 className="font-medium text-white mb-4">Cache Flow</h4>
              <div className="bg-slate-900 p-4 rounded-lg">
                <div className="flex flex-col items-center">
                  {/* Request */}
                  <div className="bg-blue-900 rounded p-2 w-full max-w-xs text-center mb-4">
                    <span className="text-sm text-white">Incoming API Request</span>
                  </div>
                  
                  {/* Check Cache */}
                  <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  
                  {/* Decision Diamond */}
                  <div className="bg-amber-900 rounded-lg p-3 w-full max-w-xs text-center mb-4 transform rotate-45">
                    <div className="transform -rotate-45">
                      <span className="text-sm text-white">Cache Hit?</span>
                    </div>
                  </div>
                  
                  {/* Branches */}
                  <div className="flex w-full justify-center space-x-12 mb-4">
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-green-400 mb-2">Yes</span>
                      <div className="bg-green-900 rounded p-2 w-32 text-center">
                        <span className="text-xs text-white">Return Cached Data</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-red-400 mb-2">No</span>
                      <div className="bg-red-900 rounded p-2 w-32 text-center">
                        <span className="text-xs text-white">Request External API</span>
                      </div>
                      <svg className="h-5 w-5 text-slate-600 my-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      <div className="bg-indigo-900 rounded p-2 w-32 text-center">
                        <span className="text-xs text-white">Store in Cache</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Response */}
                  <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                  </svg>
                  <div className="bg-purple-900 rounded p-2 w-full max-w-xs text-center">
                    <span className="text-sm text-white">Send Response to Client</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Cache Implementation Code */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-slate-400 mb-2">Cache Implementation</h4>
            <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto font-mono text-sm text-slate-300">
{`// cache.js - Redis cache implementation
const Redis = require('ioredis');
const config = require('./config');

class CacheService {
  constructor() {
    this.redis = new Redis(config.redis);
    this.defaultTTL = 60; // 60 seconds
    
    // TTL configurations for different data types
    this.ttlConfig = {
      prices: 30,         // 30 seconds
      singlePrice: 15,    // 15 seconds
      history: 300,       // 5 minutes
      markets: 120,       // 2 minutes
      trending: 600        // 10 minutes
    };
  }
  
  async get(key) {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(\`Cache get error: \${error.message}\`);
      return null;
    }
  }
  
  async set(key, data, type = 'default') {
    try {
      const ttl = this.ttlConfig[type] || this.defaultTTL;
      await this.redis.setex(
        key,
        ttl,
        JSON.stringify(data)
      );
      return true;
    } catch (error) {
      console.error(\`Cache set error: \${error.message}\`);
      return false;
    }
  }
  
  async invalidate(pattern) {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
      return true;
    } catch (error) {
      console.error(\`Cache invalidation error: \${error.message}\`);
      return false;
    }
  }
}

module.exports = new CacheService();`}
            </pre>
          </div>
          
          {/* Cache Metrics */}
          <div>
            <h4 className="font-medium text-white mb-4">Cache Performance Metrics</h4>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-slate-900 p-4 rounded-lg animate-pulse h-28" />
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-900 text-red-200 p-4 rounded">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-slate-400 mb-2">Cache Hit Rate</h5>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-green-400">{metrics?.cache_hit_rate.toFixed(1)}%</span>
                    <span className="ml-2 text-sm text-slate-500">last 24h</span>
                  </div>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-slate-400 mb-2">Average TTL</h5>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-blue-400">47s</span>
                    <span className="ml-2 text-sm text-slate-500">across all keys</span>
                  </div>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-slate-400 mb-2">Memory Usage</h5>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-amber-400">{metrics?.cache_stats?.size || 0}</span>
                    <span className="ml-2 text-sm text-slate-500">active cache entries</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
