import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card } from '@/components/ui/card';
import plantumlEncoder from 'plantuml-encoder';

export default function UmlDiagram() {
  const [diagramUrl, setDiagramUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate PlantUML diagram
    const uml = `@startuml
!theme plain
skinparam shadowing false
skinparam backgroundColor white
skinparam ArrowColor #333333
skinparam ClassBorderColor #333333
skinparam ClassBackgroundColor #f8f9fa
skinparam ClassFontColor #333333
skinparam NoteBackgroundColor #f8f9fa
skinparam NoteBorderColor #333333
skinparam PackageBackgroundColor #f8f9fa
skinparam PackageBorderColor #333333

title Crypto Price Tracker Architecture

package "Client Application" {
  namespace "Components" {
    class "AppLayout" {
      +children: ReactNode
      +render()
    }
    
    class "AppHeader" {
      -isMobileMenuOpen: boolean
      -apiStatus: object
      +checkApiStatus()
      +render()
    }
    
    class "Sidebar" {
      -activeRoute: string
      +navigateTo(route)
      +render()
    }
    
    class "PriceCard" {
      -cryptocurrencies: Cryptocurrency[]
      -isLoading: boolean
      -error: string
      +fetchCryptocurrencies()
      +render()
    }
    
    class "StatusCard" {
      +title: string
      +value: string|number
      +icon: ReactNode
      +iconBgColor: string
      +change?: object
      +period?: string
      +render()
    }
    
    class "ResponseTimeChart" {
      -timeframe: string
      -data: ResponseTimeData[]
      -isLoading: boolean
      -error: string
      +fetchData()
      +formatTimestamp()
      +render()
    }
  }
  
  namespace "Pages" {
    class "Dashboard" {
      -metrics: Metrics
      -isLoading: boolean
      -error: string
      +fetchMetrics()
      +render()
    }
    
    class "Architecture" {
      +render()
    }
    
    class "ApiDocs" {
      +render()
    }
    
    class "Performance" {
      -metrics: PerformanceMetrics
      -isLoading: boolean
      -error: string
      +fetchMetrics()
      +render()
    }
    
    class "Caching" {
      -metrics: CacheMetrics
      -isLoading: boolean
      -error: string
      +fetchMetrics()
      +render()
    }
  }
  
  namespace "Utils" {
    class "QueryClient" {
      +apiRequest(method, url, data)
      +throwIfResNotOk(res)
      +getQueryFn(options)
    }
  }
}

package "Server Application" {
  namespace "Core" {
    class "Server" {
      +app: Express
      +start()
      +setupMiddleware()
      +registerRoutes()
    }
    
    class "Routes" {
      +registerRoutes(app)
    }
  }
  
  namespace "Services" {
    class "CacheService" {
      -cache: Map<string, CacheItem>
      -defaultTTL: number
      -ttlConfig: Record<string, number>
      +get<T>(key): Promise<T | null>
      +set(key, data, type): Promise<boolean>
      +invalidate(key): void
      +invalidatePattern(pattern): void
      +clear(): void
      +getStats(): object
    }
    
    class "CryptoService" {
      +getAllPrices(currency): Promise<Cryptocurrency[]>
      +getPriceBySymbol(symbol, currency): Promise<Cryptocurrency | null>
      +getHistoricalPrices(symbol, interval, limit): Promise<any[]>
      +getMarketData(currency, limit): Promise<any[]>
      +getTrendingCryptocurrencies(limit): Promise<Cryptocurrency[]>
      +getPerformanceMetrics(): Promise<any>
      +warmCache(): Promise<void>
    }
    
    class "LoggerService" {
      -responseTimeData: number[]
      -cacheHits: number
      -cacheMisses: number
      -totalRequests: number
      -errorCount: number
      +logApiRequest(log): Promise<void>
      +updatePerformanceMetrics(): Promise<void>
      +getLatestMetrics(): object
    }
  }
  
  namespace "Controllers" {
    class "CryptoController" {
      +getAllPrices(req, res, next)
      +getPriceBySymbol(req, res, next)
      +getHistoricalPrices(req, res, next)
      +getMarketData(req, res, next)
      +getTrendingCryptocurrencies(req, res, next)
      +getPerformanceMetrics(req, res, next)
    }
  }
  
  namespace "Middleware" {
    class "CacheMiddleware" {
      +middleware(req, res, next)
    }
    
    class "RateLimiter" {
      -windowMs: number
      -maxRequests: number
      -clients: Map<string, RateLimitEntry>
      +middleware(req, res, next)
    }
    
    class "ErrorHandler" {
      +errorHandler(err, req, res, next)
      +createApiError(message, status, code)
      +notFoundHandler(req, res, next)
    }
  }
  
  namespace "Storage" {
    class "MemStorage" {
      -users: Map<number, User>
      -cacheEntries: Map<string, CacheEntry>
      -apiLogs: ApiLog[]
      -cryptocurrencies: Map<number, Cryptocurrency>
      -historicalPrices: Map<number, HistoricalPrice[]>
      -performanceMetrics: PerformanceMetric[]
      +getUser(id): Promise<User | undefined>
      +getCacheEntry(key): Promise<CacheEntry | undefined>
      +createCacheEntry(entry): Promise<CacheEntry>
      +getAllCryptocurrencies(): Promise<Cryptocurrency[]>
      +getCryptocurrencyBySymbol(symbol): Promise<Cryptocurrency | undefined>
      +createHistoricalPrice(price): Promise<HistoricalPrice>
      +getLatestPerformanceMetrics(limit): Promise<PerformanceMetric[]>
    }
    
    interface "IStorage" {
      +getUser(id): Promise<User | undefined>
      +getCacheEntry(key): Promise<CacheEntry | undefined>
      +createCacheEntry(entry): Promise<CacheEntry>
      +getAllCryptocurrencies(): Promise<Cryptocurrency[]>
      +getCryptocurrencyBySymbol(symbol): Promise<Cryptocurrency | undefined>
      +createHistoricalPrice(price): Promise<HistoricalPrice>
      +getLatestPerformanceMetrics(limit): Promise<PerformanceMetric[]>
    }
  }
  
  namespace "Models" {
    class "User" {
      +id: number
      +username: string
      +email: string
      +password: string
    }
    
    class "Cryptocurrency" {
      +id: number
      +symbol: string
      +name: string
      +current_price: number
      +price_change_24h: number
      +market_cap: number
      +total_volume: number
      +circulating_supply: number
    }
    
    class "CacheEntry" {
      +id: number
      +key: string
      +data: string
      +hits: number
      +expires_at: Date
      +created_at: Date
    }
    
    class "ApiLog" {
      +id: number
      +path: string
      +method: string
      +status: number
      +response_time: number
      +source: string
      +timestamp: Date
    }
    
    class "HistoricalPrice" {
      +id: number
      +cryptocurrency_id: number
      +price: number
      +timestamp: Date
    }
    
    class "PerformanceMetric" {
      +id: number
      +avg_response_time: number
      +cache_hit_rate: number
      +requests_per_second: number
      +error_rate: number
      +timestamp: Date
    }
  }
}

' Relationships
IStorage <|.. MemStorage : implements
Server --> Routes : uses
Routes --> CryptoController : registers
CryptoController --> CryptoService : uses
CryptoController --> CacheService : uses
CryptoService --> MemStorage : uses
ApiDocs --> AppLayout : uses
Architecture --> AppLayout : uses
Dashboard --> AppLayout : uses
Performance --> AppLayout : uses
Caching --> AppLayout : uses
Dashboard --> PriceCard : uses
Dashboard --> StatusCard : uses
Dashboard --> ResponseTimeChart : uses
AppLayout --> AppHeader : uses
AppLayout --> Sidebar : uses
Server --> CacheMiddleware : uses
Server --> RateLimiter : uses
Server --> ErrorHandler : uses
CacheMiddleware --> CacheService : uses
LoggerService --> MemStorage : uses

@enduml`;

    // Encode the PlantUML code
    const encodedUml = plantumlEncoder.encode(uml);
    
    // Generate the URL for the SVG diagram
    const diagramUrl = `http://www.plantuml.com/plantuml/svg/${encodedUml}`;
    
    setDiagramUrl(diagramUrl);
    setIsLoading(false);
  }, []);

  return (
    <AppLayout>
      <div id="uml-diagram" className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">UML Diagram</h2>
        
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">Application Architecture</h3>
            <p className="text-slate-300 mb-4">
              This UML class diagram illustrates the structure and relationships of the Crypto Price Tracker application components.
            </p>
          </div>
          
          {isLoading ? (
            <div className="bg-slate-800 rounded-lg p-4 h-96 flex items-center justify-center">
              <div className="text-slate-400">Loading UML diagram...</div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4 overflow-auto">
              {diagramUrl ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={diagramUrl} 
                    alt="Crypto Price Tracker UML Diagram" 
                    className="max-w-full"
                    style={{ minWidth: "800px" }}
                  />
                  <div className="mt-4 text-slate-800 text-sm">
                    <p>The diagram shows the key components of both client and server applications and how they interact.</p>
                  </div>
                </div>
              ) : (
                <div className="text-red-500">Failed to generate UML diagram.</div>
              )}
            </div>
          )}
          
          <div className="mt-6">
            <h4 className="font-medium text-white mb-2">Key Components</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800 p-4 rounded-lg">
                <h5 className="text-sm font-medium text-slate-200">Client Application</h5>
                <ul className="list-disc pl-5 text-slate-300 text-sm mt-2 space-y-1">
                  <li>React components for UI presentation</li>
                  <li>Pages for different application sections</li>
                  <li>Utility services for API communication</li>
                </ul>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg">
                <h5 className="text-sm font-medium text-slate-200">Server Application</h5>
                <ul className="list-disc pl-5 text-slate-300 text-sm mt-2 space-y-1">
                  <li>Express.js middleware for request processing</li>
                  <li>Services for business logic and data access</li>
                  <li>Controllers for handling API endpoints</li>
                  <li>In-memory storage for data persistence</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}