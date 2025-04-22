import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/queryClient';

export function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<{ operational: boolean, responseTime: number }>({ 
    operational: true, 
    responseTime: 0 
  });

  // Check API status
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const start = Date.now();
        const response = await apiRequest('GET', '/api/v1/metrics');
        const data = await response.json();
        setApiStatus({
          operational: true,
          responseTime: data.data.avg_response_time || Date.now() - start,
        });
      } catch (error) {
        setApiStatus({
          operational: false,
          responseTime: 0,
        });
      }
    };

    checkApiStatus();
    const interval = setInterval(checkApiStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-800 border-b border-slate-700 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center md:hidden">
          <button 
            type="button" 
            className="text-slate-400 hover:text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="ml-2 text-xl font-bold text-white">CryptoTrack API</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button type="button" className="flex items-center text-sm text-slate-400 hover:text-white">
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="hidden md:inline">Notifications</span>
          </button>
          
          <div className="h-6 border-r border-slate-700"></div>
          
          <div className="flex items-center">
            <span className="text-sm font-medium text-slate-400 mr-2 hidden md:inline">API Status:</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              apiStatus.operational 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
              {apiStatus.operational ? 'Operational' : 'Degraded'}
            </span>
          </div>
          
          <div className="h-6 border-r border-slate-700"></div>
          
          <div className="flex items-center">
            <img 
              className="h-8 w-8 rounded-full border border-slate-700" 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="User profile"
            />
            <span className="ml-2 text-sm font-medium text-white hidden md:inline">Admin</span>
          </div>
        </div>
      </div>
      
      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-slate-700">Dashboard</a>
            <a href="/architecture" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white">Architecture</a>
            <a href="/api-docs" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white">API Documentation</a>
            <a href="/performance" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white">Performance</a>
            <a href="/caching" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white">Caching System</a>
          </div>
        </div>
      )}
    </header>
  );
}
