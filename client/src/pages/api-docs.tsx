import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';

export default function ApiDocs() {
  return (
    <AppLayout>
      <div id="api-docs" className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">API Documentation</h2>
        
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">Endpoints</h3>
            <p className="text-slate-300 mb-4">The API provides the following endpoints for cryptocurrency data retrieval:</p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-slate-900 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Endpoint</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Method</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Cache TTL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-slate-300">/api/v1/prices</td>
                    <td className="px-4 py-3 text-sm text-blue-400">GET</td>
                    <td className="px-4 py-3 text-sm text-slate-300">Get current prices for all supported cryptocurrencies</td>
                    <td className="px-4 py-3 text-sm text-slate-300">30 seconds</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-slate-300">/api/v1/prices/:symbol</td>
                    <td className="px-4 py-3 text-sm text-blue-400">GET</td>
                    <td className="px-4 py-3 text-sm text-slate-300">Get current price for a specific cryptocurrency</td>
                    <td className="px-4 py-3 text-sm text-slate-300">15 seconds</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-slate-300">/api/v1/history/:symbol</td>
                    <td className="px-4 py-3 text-sm text-blue-400">GET</td>
                    <td className="px-4 py-3 text-sm text-slate-300">Get historical price data for a cryptocurrency</td>
                    <td className="px-4 py-3 text-sm text-slate-300">5 minutes</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-slate-300">/api/v1/markets</td>
                    <td className="px-4 py-3 text-sm text-blue-400">GET</td>
                    <td className="px-4 py-3 text-sm text-slate-300">Get market data (volume, cap) for all cryptocurrencies</td>
                    <td className="px-4 py-3 text-sm text-slate-300">2 minutes</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-slate-300">/api/v1/trending</td>
                    <td className="px-4 py-3 text-sm text-blue-400">GET</td>
                    <td className="px-4 py-3 text-sm text-slate-300">Get trending cryptocurrencies</td>
                    <td className="px-4 py-3 text-sm text-slate-300">10 minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium text-white mb-2">Request Example</h4>
              <div className="bg-slate-900 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-blue-400 font-medium">GET</span>
                  <span className="ml-2 font-mono text-sm text-slate-300">/api/v1/prices/BTC</span>
                </div>
                <div className="text-sm text-slate-400 mb-2">Headers:</div>
                <pre className="font-mono text-xs text-slate-300">
Accept: application/json
Authorization: Bearer &lt;api_key&gt;
                </pre>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">Response Example</h4>
              <div className="bg-slate-900 p-4 rounded-lg">
                <div className="text-sm text-slate-400 mb-2">200 OK</div>
                <pre className="font-mono text-xs text-slate-300">
{`{
  "success": true,
  "source": "cache",
  "data": {
    "symbol": "BTC",
    "name": "Bitcoin",
    "price": 43856.21,
    "change_24h": 2.4,
    "updated_at": "2023-09-01T14:37:22Z",
    "currency": "USD"
  }
}`}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium text-white mb-2">Error Responses</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 p-4 rounded-lg">
                <div className="text-sm text-amber-400 mb-2">404 Not Found</div>
                <pre className="font-mono text-xs text-slate-300">
{`{
  "success": false,
  "error": {
    "code": "resource_not_found",
    "message": "Cryptocurrency with symbol 'XYZ' not found"
  }
}`}
                </pre>
              </div>
              <div className="bg-slate-900 p-4 rounded-lg">
                <div className="text-sm text-red-400 mb-2">429 Too Many Requests</div>
                <pre className="font-mono text-xs text-slate-300">
{`{
  "success": false,
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded. Try again in 58 seconds",
    "retry_after": 58
  }
}`}
                </pre>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-4">Query Parameters</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-slate-900 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Parameter</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Default</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-slate-300">currency</td>
                    <td className="px-4 py-3 text-sm text-slate-300">string</td>
                    <td className="px-4 py-3 text-sm text-slate-300">USD</td>
                    <td className="px-4 py-3 text-sm text-slate-300">Currency for price conversion (USD, EUR, GBP, etc.)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-slate-300">interval</td>
                    <td className="px-4 py-3 text-sm text-slate-300">string</td>
                    <td className="px-4 py-3 text-sm text-slate-300">1d</td>
                    <td className="px-4 py-3 text-sm text-slate-300">For historical data: 1h, 1d, 7d, 30d, 90d, 1y</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-slate-300">limit</td>
                    <td className="px-4 py-3 text-sm text-slate-300">integer</td>
                    <td className="px-4 py-3 text-sm text-slate-300">100</td>
                    <td className="px-4 py-3 text-sm text-slate-300">Number of results to return (max 1000)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-slate-300">skip_cache</td>
                    <td className="px-4 py-3 text-sm text-slate-300">boolean</td>
                    <td className="px-4 py-3 text-sm text-slate-300">false</td>
                    <td className="px-4 py-3 text-sm text-slate-300">Force fresh data retrieval, bypassing cache</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
