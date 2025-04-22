import {
  users,
  type User,
  type InsertUser,
  cacheEntries,
  type CacheEntry,
  type InsertCacheEntry,
  apiLogs,
  type ApiLog,
  type InsertApiLog,
  cryptocurrencies,
  type Cryptocurrency,
  type InsertCryptocurrency,
  historicalPrices,
  type HistoricalPrice,
  type InsertHistoricalPrice,
  performanceMetrics,
  type PerformanceMetric,
  type InsertPerformanceMetric
} from "@shared/schema";

// In-memory storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Cache methods
  getCacheEntry(key: string): Promise<CacheEntry | undefined>;
  createCacheEntry(entry: InsertCacheEntry): Promise<CacheEntry>;
  incrementCacheHits(key: string): Promise<void>;
  cleanExpiredCache(): Promise<void>;

  // API Log methods
  createApiLog(log: InsertApiLog): Promise<ApiLog>;
  getApiLogs(limit?: number): Promise<ApiLog[]>;

  // Cryptocurrency methods
  getAllCryptocurrencies(): Promise<Cryptocurrency[]>;
  getCryptocurrencyBySymbol(symbol: string): Promise<Cryptocurrency | undefined>;
  createCryptocurrency(crypto: InsertCryptocurrency): Promise<Cryptocurrency>;
  updateCryptocurrency(symbol: string, data: Partial<InsertCryptocurrency>): Promise<Cryptocurrency | undefined>;

  // Historical Price methods
  getHistoricalPrices(cryptocurrencyId: number, limit?: number): Promise<HistoricalPrice[]>;
  createHistoricalPrice(price: InsertHistoricalPrice): Promise<HistoricalPrice>;

  // Performance Metrics methods
  createPerformanceMetric(metric: InsertPerformanceMetric): Promise<PerformanceMetric>;
  getLatestPerformanceMetrics(limit?: number): Promise<PerformanceMetric[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private usernameToId: Map<string, number>;
  private cacheEntries: Map<string, CacheEntry>;
  private apiLogs: ApiLog[];
  private cryptocurrencies: Map<number, Cryptocurrency>;
  private symbolToId: Map<string, number>;
  private historicalPrices: Map<number, HistoricalPrice[]>;
  private performanceMetrics: PerformanceMetric[];
  
  private userId: number;
  private cacheId: number;
  private apiLogId: number;
  private cryptoId: number;
  private historicalPriceId: number;
  private performanceMetricId: number;

  constructor() {
    this.users = new Map();
    this.usernameToId = new Map();
    this.cacheEntries = new Map();
    this.apiLogs = [];
    this.cryptocurrencies = new Map();
    this.symbolToId = new Map();
    this.historicalPrices = new Map();
    this.performanceMetrics = [];
    
    this.userId = 1;
    this.cacheId = 1;
    this.apiLogId = 1;
    this.cryptoId = 1;
    this.historicalPriceId = 1;
    this.performanceMetricId = 1;

    // Initialize with some sample cryptocurrencies
    this.initializeCryptocurrencies();
  }

  // Initialize with sample cryptocurrencies
  private initializeCryptocurrencies() {
    const cryptos = [
      { symbol: "BTC", name: "Bitcoin", current_price: 43856.21, price_change_24h: 2.4 },
      { symbol: "ETH", name: "Ethereum", current_price: 3287.45, price_change_24h: 1.7 },
      { symbol: "SOL", name: "Solana", current_price: 106.92, price_change_24h: -0.8 },
      { symbol: "DOGE", name: "Dogecoin", current_price: 0.078, price_change_24h: -1.3 },
      { symbol: "ADA", name: "Cardano", current_price: 0.396, price_change_24h: 0.5 },
    ];

    cryptos.forEach(crypto => {
      this.createCryptocurrency({
        symbol: crypto.symbol,
        name: crypto.name,
        current_price: crypto.current_price,
        price_change_24h: crypto.price_change_24h,
        last_updated: new Date(),
        metadata: {}
      });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const id = this.usernameToId.get(username);
    if (id === undefined) return undefined;
    return this.users.get(id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    this.usernameToId.set(user.username, id);
    return user;
  }

  // Cache methods
  async getCacheEntry(key: string): Promise<CacheEntry | undefined> {
    const entry = this.cacheEntries.get(key);
    if (!entry) return undefined;
    
    // Check if cache entry is expired
    if (entry.expires_at < new Date()) {
      this.cacheEntries.delete(key);
      return undefined;
    }
    
    return entry;
  }

  async createCacheEntry(entry: InsertCacheEntry): Promise<CacheEntry> {
    const id = this.cacheId++;
    const cacheEntry: CacheEntry = { 
      ...entry, 
      id, 
      created_at: new Date(),
      hits: 0
    };
    this.cacheEntries.set(entry.key, cacheEntry);
    return cacheEntry;
  }

  async incrementCacheHits(key: string): Promise<void> {
    const entry = this.cacheEntries.get(key);
    if (entry) {
      entry.hits += 1;
      this.cacheEntries.set(key, entry);
    }
  }

  async cleanExpiredCache(): Promise<void> {
    const now = new Date();
    for (const [key, entry] of this.cacheEntries.entries()) {
      if (entry.expires_at < now) {
        this.cacheEntries.delete(key);
      }
    }
  }

  // API Log methods
  async createApiLog(log: InsertApiLog): Promise<ApiLog> {
    const id = this.apiLogId++;
    const apiLog: ApiLog = { ...log, id };
    this.apiLogs.push(apiLog);
    return apiLog;
  }

  async getApiLogs(limit = 100): Promise<ApiLog[]> {
    return this.apiLogs.slice(-limit);
  }

  // Cryptocurrency methods
  async getAllCryptocurrencies(): Promise<Cryptocurrency[]> {
    return Array.from(this.cryptocurrencies.values());
  }

  async getCryptocurrencyBySymbol(symbol: string): Promise<Cryptocurrency | undefined> {
    const id = this.symbolToId.get(symbol);
    if (id === undefined) return undefined;
    return this.cryptocurrencies.get(id);
  }

  async createCryptocurrency(crypto: InsertCryptocurrency): Promise<Cryptocurrency> {
    const id = this.cryptoId++;
    const cryptocurrency: Cryptocurrency = { ...crypto, id };
    this.cryptocurrencies.set(id, cryptocurrency);
    this.symbolToId.set(crypto.symbol, id);
    return cryptocurrency;
  }

  async updateCryptocurrency(symbol: string, data: Partial<InsertCryptocurrency>): Promise<Cryptocurrency | undefined> {
    const id = this.symbolToId.get(symbol);
    if (id === undefined) return undefined;
    
    const cryptocurrency = this.cryptocurrencies.get(id);
    if (!cryptocurrency) return undefined;
    
    const updatedCrypto: Cryptocurrency = { ...cryptocurrency, ...data };
    this.cryptocurrencies.set(id, updatedCrypto);
    return updatedCrypto;
  }

  // Historical Price methods
  async getHistoricalPrices(cryptocurrencyId: number, limit = 100): Promise<HistoricalPrice[]> {
    const prices = this.historicalPrices.get(cryptocurrencyId) || [];
    return prices.slice(-limit);
  }

  async createHistoricalPrice(price: InsertHistoricalPrice): Promise<HistoricalPrice> {
    const id = this.historicalPriceId++;
    const historicalPrice: HistoricalPrice = { ...price, id };
    
    const prices = this.historicalPrices.get(price.cryptocurrency_id) || [];
    prices.push(historicalPrice);
    this.historicalPrices.set(price.cryptocurrency_id, prices);
    
    return historicalPrice;
  }

  // Performance Metrics methods
  async createPerformanceMetric(metric: InsertPerformanceMetric): Promise<PerformanceMetric> {
    const id = this.performanceMetricId++;
    const performanceMetric: PerformanceMetric = { ...metric, id };
    this.performanceMetrics.push(performanceMetric);
    return performanceMetric;
  }

  async getLatestPerformanceMetrics(limit = 1): Promise<PerformanceMetric[]> {
    return this.performanceMetrics.slice(-limit);
  }
}

export const storage = new MemStorage();
