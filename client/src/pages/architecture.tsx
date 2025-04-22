import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';

export default function Architecture() {
  return (
    <AppLayout>
      <div id="architecture" className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Backend Architecture</h2>
        
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">System Overview</h3>
            <p className="text-slate-300">The backend is structured as a RESTful API with efficient caching mechanisms to optimize cryptocurrency data retrieval and processing.</p>
          </div>
          
          {/* Architecture Diagram */}
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 mb-6">
            <h4 className="text-sm font-medium text-slate-400 mb-4">Architecture Diagram</h4>
            <div className="h-80 bg-slate-950 rounded-lg p-6 relative overflow-hidden">
              {/* Client */}
              <div className="absolute top-4 left-[50%] transform -translate-x-1/2 w-36 bg-blue-900 text-white rounded p-2 text-center text-sm">
                <div className="font-medium">React Frontend</div>
                <div className="text-xs text-blue-300 mt-1">Client Application</div>
              </div>
              
              {/* Arrow Down */}
              <div className="absolute top-[70px] left-[50%] transform -translate-x-1/2">
                <svg className="h-10 w-10 text-blue-500" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14m0 0l-5-5m5 5l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              {/* API Gateway */}
              <div className="absolute top-24 left-[50%] transform -translate-x-1/2 w-64 bg-indigo-900 text-white rounded p-2 text-center text-sm">
                <div className="font-medium">API Gateway & Auth</div>
                <div className="text-xs text-indigo-300 mt-1">Rate limiting, routing, security</div>
              </div>
              
              {/* Arrow Down */}
              <div className="absolute top-[160px] left-[50%] transform -translate-x-1/2">
                <svg className="h-10 w-10 text-indigo-500" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14m0 0l-5-5m5 5l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              {/* Cache + API Handler */}
              <div className="absolute top-48 left-1/2 transform -translate-x-1/2 flex w-full justify-center gap-4">
                {/* Redis Cache */}
                <div className="w-40 bg-red-900 text-white rounded p-2 text-center text-sm">
                  <div className="font-medium">Redis Cache</div>
                  <div className="text-xs text-red-300 mt-1">In-memory data store</div>
                </div>
                
                {/* API Logic */}
                <div className="w-40 bg-green-900 text-white rounded p-2 text-center text-sm">
                  <div className="font-medium">API Service</div>
                  <div className="text-xs text-green-300 mt-1">Business logic, processing</div>
                </div>
              </div>
              
              {/* Arrow Down */}
              <div className="absolute top-[240px] left-[50%] transform -translate-x-1/2">
                <svg className="h-10 w-10 text-emerald-500" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14m0 0l-5-5m5 5l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              {/* External API */}
              <div className="absolute bottom-4 left-[50%] transform -translate-x-1/2 w-48 bg-purple-900 text-white rounded p-2 text-center text-sm">
                <div className="font-medium">Premium Crypto API</div>
                <div className="text-xs text-purple-300 mt-1">External data source</div>
              </div>
            </div>
          </div>

          {/* Key Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">RESTful API Layer</h4>
              <ul className="list-disc pl-5 text-slate-300 text-sm space-y-1">
                <li>Express.js framework for routing and middleware</li>
                <li>Standard HTTP methods (GET, POST, PUT, DELETE)</li>
                <li>JSON-based request/response format</li>
                <li>Versioned endpoints (/api/v1/...)</li>
              </ul>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Caching System</h4>
              <ul className="list-disc pl-5 text-slate-300 text-sm space-y-1">
                <li>Redis as primary caching layer</li>
                <li>Time-based expiration for price data</li>
                <li>Distributed cache with replication</li>
                <li>Cache warming for popular crypto assets</li>
              </ul>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Data Processing</h4>
              <ul className="list-disc pl-5 text-slate-300 text-sm space-y-1">
                <li>Middleware for data transformation</li>
                <li>Historical data aggregation</li>
                <li>Trend analysis and calculation</li>
                <li>Real-time price normalization</li>
              </ul>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Request Handling</h4>
              <ul className="list-disc pl-5 text-slate-300 text-sm space-y-1">
                <li>Rate limiting and throttling</li>
                <li>Batched requests to external API</li>
                <li>Conditional requests (If-Modified-Since)</li>
                <li>Compression for response payloads</li>
              </ul>
            </div>
          </div>

          {/* Code Example */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-slate-400 mb-2">Implementation Example (server.js)</h4>
            <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto font-mono text-sm text-slate-300">
{`// Server setup with Express
const express = require('express');
const Redis = require('ioredis');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 3000;

// Redis client setup
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379,
  password: process.env.REDIS_PASSWORD
});

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// Cache middleware for crypto price data
const cachePriceData = async (req, res, next) => {
  const { symbol } = req.params;
  try {
    const cachedData = await redis.get(\`crypto:\${symbol}\`);
    
    if (cachedData) {
      const data = JSON.parse(cachedData);
      return res.json({
        source: 'cache',
        data: data
      });
    }
    
    next();
  } catch (err) {
    next(err);
  }
};`}
            </pre>
          </div>
          
          {/* Request Flow */}
          <div>
            <h4 className="text-sm font-medium text-slate-400 mb-2">Request Flow</h4>
            <ol className="list-decimal pl-5 text-slate-300 space-y-2">
              <li>Client sends request for cryptocurrency data</li>
              <li>API Gateway validates request and applies rate limiting</li>
              <li>System checks Redis cache for requested data
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-400">
                  <li>If data exists and is not expired, returns cached data</li>
                  <li>If not in cache, proceeds to next step</li>
                </ul>
              </li>
              <li>Makes authenticated request to Premium Crypto API</li>
              <li>Processes and transforms the response data</li>
              <li>Stores processed data in Redis cache with TTL</li>
              <li>Returns formatted response to client</li>
            </ol>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
