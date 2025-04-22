#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const plantumlEncoder = require('plantuml-encoder');
const { program } = require('commander');

program
  .description('Generate UML diagrams for the crypto price tracker application')
  .option('-o, --output <file>', 'output file for the UML diagram', 'crypto-tracker-uml.png')
  .option('-f, --format <format>', 'output format (png, svg)', 'png')
  .option('-s, --server', 'only generate diagram for server components', false)
  .option('-c, --client', 'only generate diagram for client components', false)
  .parse(process.argv);

const options = program.opts();
const isServer = options.server;
const isClient = options.client;
const outputFile = options.output;
const format = options.format;

// Map of class (or file) relationships
const relationships = [];

// Generate PlantUML code
function generateUml() {
  let uml = `@startuml
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

  return uml;
}

// Generate the UML diagram
function generateDiagram() {
  const umlCode = generateUml();
  const encodedUml = plantumlEncoder.encode(umlCode);
  
  // For PNG format
  const plantumlServer = 'http://www.plantuml.com/plantuml';
  const diagramUrl = `${plantumlServer}/${format}/${encodedUml}`;
  
  console.log(`Generated PlantUML code. You can view the diagram at:\n${diagramUrl}`);
  console.log(`\nYou can also use this link directly in your browser or embedding in Markdown:\n${plantumlServer}/proxy?fmt=${format}&src=${encodedUml}`);
  
  // Save the UML code for reference
  fs.writeFileSync('crypto-tracker-uml.puml', umlCode);
  console.log('\nUML code saved to: crypto-tracker-uml.puml');
  
  return diagramUrl;
}

// Execute
try {
  generateDiagram();
} catch (error) {
  console.error('Error generating UML diagram:', error);
  process.exit(1);
}