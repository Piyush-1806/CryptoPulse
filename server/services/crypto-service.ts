/**
 * Crypto Service
 * 
 * Handles interaction with the cryptocurrency data API and processes the results.
 */

import { storage } from '../storage';
import { cacheService } from './cache-service';
import { loggerService } from './logger-service';
import type { Cryptocurrency, InsertCryptocurrency } from '@shared/schema';

// Default supported cryptocurrencies
const SUPPORTED_CRYPTOCURRENCIES = [
  'BTC', 'ETH', 'SOL', 'DOGE', 'ADA', 
  'XRP', 'DOT', 'MATIC', 'LTC', 'LINK',
  'AVAX', 'SHIB', 'UNI', 'ATOM', 'XLM',
  'NEAR', 'ALGO', 'FTM', 'ICP', 'VET'
];

class CryptoService {
  // In a real application, this would call the external premium API
  // For this example, we'll simulate the API calls with our storage
  
  /**
   * Get all cryptocurrency prices
   */
  async getAllPrices(currency: string = 'USD'): Promise<Cryptocurrency[]> {
    const cacheKey = `prices:all:${currency}`;
    
    // Try to get from cache first
    const cachedData = await cacheService.get<Cryptocurrency[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // Simulate API call
    const startTime = Date.now();
    
    // Get all cryptocurrencies from storage
    const cryptos = await storage.getAllCryptocurrencies();
    
    // Simulate processing delay
    await this.simulateProcessingDelay(10, 50);
    
    // Update prices with random fluctuations to simulate real-time changes
    const updatedCryptos = cryptos.map(crypto => ({
      ...crypto,
      current_price: this.applyRandomPriceChange(crypto.current_price),
      last_updated: new Date(),
    }));
    
    // Update storage with new prices
    for (const crypto of updatedCryptos) {
      await storage.updateCryptocurrency(crypto.symbol, {
        current_price: crypto.current_price,
        last_updated: crypto.last_updated
      });
    }
    
    // Cache the result
    await cacheService.set(cacheKey, updatedCryptos, 'prices');
    
    const responseTime = Date.now() - startTime;
    
    // Log this call
    await loggerService.logApiRequest({
      endpoint: '/api/v1/prices',
      method: 'GET',
      status_code: 200,
      response_time: responseTime,
      cache_hit: false,
      timestamp: new Date(),
      user_agent: 'internal',
      ip_address: '127.0.0.1'
    });
    
    return updatedCryptos;
  }
  
  /**
   * Get price for a specific cryptocurrency
   */
  async getPriceBySymbol(symbol: string, currency: string = 'USD'): Promise<Cryptocurrency | null> {
    const cacheKey = `prices:${symbol}:${currency}`;
    
    // Try to get from cache first
    const cachedData = await cacheService.get<Cryptocurrency>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // Simulate API call
    const startTime = Date.now();
    
    // Get cryptocurrency from storage
    let crypto = await storage.getCryptocurrencyBySymbol(symbol.toUpperCase());
    if (!crypto) {
      return null;
    }
    
    // Simulate processing delay
    await this.simulateProcessingDelay(5, 20);
    
    // Update price with random fluctuations
    crypto = {
      ...crypto,
      current_price: this.applyRandomPriceChange(crypto.current_price),
      last_updated: new Date(),
    };
    
    // Update storage
    await storage.updateCryptocurrency(crypto.symbol, {
      current_price: crypto.current_price,
      last_updated: crypto.last_updated
    });
    
    // Cache the result
    await cacheService.set(cacheKey, crypto, 'singlePrice');
    
    const responseTime = Date.now() - startTime;
    
    // Log this call
    await loggerService.logApiRequest({
      endpoint: `/api/v1/prices/${symbol}`,
      method: 'GET',
      status_code: 200,
      response_time: responseTime,
      cache_hit: false,
      timestamp: new Date(),
      user_agent: 'internal',
      ip_address: '127.0.0.1'
    });
    
    return crypto;
  }
  
  /**
   * Get historical price data for a cryptocurrency
   */
  async getHistoricalPrices(symbol: string, interval: string = '1d', limit: number = 30): Promise<any[]> {
    const cacheKey = `history:${symbol}:${interval}:${limit}`;
    
    // Try to get from cache first
    const cachedData = await cacheService.get<any[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // Simulate API call
    const startTime = Date.now();
    
    // Get cryptocurrency ID
    const crypto = await storage.getCryptocurrencyBySymbol(symbol.toUpperCase());
    if (!crypto) {
      return [];
    }
    
    // Simulate processing delay - historical data takes longer
    await this.simulateProcessingDelay(50, 150);
    
    // Generate historical data
    const historicalData = this.generateHistoricalData(crypto, interval, limit);
    
    // Cache the result
    await cacheService.set(cacheKey, historicalData, 'history');
    
    const responseTime = Date.now() - startTime;
    
    // Log this call
    await loggerService.logApiRequest({
      endpoint: `/api/v1/history/${symbol}`,
      method: 'GET',
      status_code: 200,
      response_time: responseTime,
      cache_hit: false,
      timestamp: new Date(),
      user_agent: 'internal',
      ip_address: '127.0.0.1'
    });
    
    return historicalData;
  }
  
  /**
   * Get market data for all cryptocurrencies
   */
  async getMarketData(currency: string = 'USD', limit: number = 100): Promise<any[]> {
    const cacheKey = `markets:${currency}:${limit}`;
    
    // Try to get from cache first
    const cachedData = await cacheService.get<any[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // Simulate API call
    const startTime = Date.now();
    
    // Get all cryptocurrencies from storage
    const cryptos = await storage.getAllCryptocurrencies();
    
    // Simulate processing delay
    await this.simulateProcessingDelay(30, 100);
    
    // Transform into market data
    const marketData = cryptos.map(crypto => ({
      symbol: crypto.symbol,
      name: crypto.name,
      current_price: crypto.current_price,
      price_change_24h: crypto.price_change_24h,
      market_cap: crypto.market_cap || this.generateMarketCap(crypto.current_price),
      volume_24h: crypto.volume_24h || this.generateVolume(crypto.current_price),
      circulating_supply: this.generateCirculatingSupply(crypto.symbol),
      last_updated: crypto.last_updated
    })).slice(0, limit);
    
    // Cache the result
    await cacheService.set(cacheKey, marketData, 'markets');
    
    const responseTime = Date.now() - startTime;
    
    // Log this call
    await loggerService.logApiRequest({
      endpoint: '/api/v1/markets',
      method: 'GET',
      status_code: 200,
      response_time: responseTime,
      cache_hit: false,
      timestamp: new Date(),
      user_agent: 'internal',
      ip_address: '127.0.0.1'
    });
    
    return marketData;
  }
  
  /**
   * Get trending cryptocurrencies
   */
  async getTrendingCryptocurrencies(limit: number = 5): Promise<Cryptocurrency[]> {
    const cacheKey = `trending:${limit}`;
    
    // Try to get from cache first
    const cachedData = await cacheService.get<Cryptocurrency[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // Simulate API call
    const startTime = Date.now();
    
    // Get all cryptocurrencies
    const cryptos = await storage.getAllCryptocurrencies();
    
    // Simulate processing delay
    await this.simulateProcessingDelay(20, 80);
    
    // Sort by absolute price change to get trending (most volatile)
    const trendingCryptos = [...cryptos]
      .sort((a, b) => Math.abs(b.price_change_24h || 0) - Math.abs(a.price_change_24h || 0))
      .slice(0, limit);
    
    // Cache the result
    await cacheService.set(cacheKey, trendingCryptos, 'trending');
    
    const responseTime = Date.now() - startTime;
    
    // Log this call
    await loggerService.logApiRequest({
      endpoint: '/api/v1/trending',
      method: 'GET',
      status_code: 200,
      response_time: responseTime,
      cache_hit: false,
      timestamp: new Date(),
      user_agent: 'internal',
      ip_address: '127.0.0.1'
    });
    
    return trendingCryptos;
  }
  
  /**
   * Get the current system performance metrics
   */
  async getPerformanceMetrics(): Promise<any> {
    // Get latest performance metrics from storage
    const dbMetrics = await storage.getLatestPerformanceMetrics(1);
    
    // Get real-time metrics from logger service
    const rtMetrics = loggerService.getLatestMetrics();
    
    // Combine metrics, preferring real-time data
    const metrics = dbMetrics.length > 0 ? {
      avg_response_time: rtMetrics.avgResponseTime || dbMetrics[0].avg_response_time,
      cache_hit_rate: rtMetrics.cacheHitRate || dbMetrics[0].cache_hit_rate,
      requests_per_second: rtMetrics.requestsPerSecond || dbMetrics[0].requests_per_second,
      error_rate: rtMetrics.errorRate || dbMetrics[0].error_rate,
      cache_stats: cacheService.getStats()
    } : {
      avg_response_time: rtMetrics.avgResponseTime || 0,
      cache_hit_rate: rtMetrics.cacheHitRate || 0,
      requests_per_second: rtMetrics.requestsPerSecond || 0,
      error_rate: rtMetrics.errorRate || 0,
      cache_stats: cacheService.getStats()
    };
    
    return metrics;
  }
  
  /**
   * Warm up the cache with popular data
   */
  async warmCache(): Promise<void> {
    try {
      console.log('Warming up cache...');
      
      // Get all prices
      await this.getAllPrices();
      
      // Get top cryptocurrencies
      for (const symbol of ['BTC', 'ETH', 'SOL', 'DOGE', 'ADA']) {
        await this.getPriceBySymbol(symbol);
      }
      
      // Get history for BTC
      await this.getHistoricalPrices('BTC');
      
      // Get market data
      await this.getMarketData();
      
      // Get trending cryptos
      await this.getTrendingCryptocurrencies();
      
      console.log('Cache warmed up successfully');
    } catch (error) {
      console.error('Error warming cache:', error);
    }
  }
  
  // Utility methods for simulating data
  
  private async simulateProcessingDelay(min: number = 10, max: number = 100): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
  
  private applyRandomPriceChange(price: number): number {
    const changePercent = (Math.random() - 0.5) * 0.2; // -0.1% to +0.1%
    return parseFloat((price * (1 + changePercent)).toFixed(price < 1 ? 6 : 2));
  }
  
  private generateHistoricalData(crypto: Cryptocurrency, interval: string, limit: number): any[] {
    const data = [];
    
    // Get appropriate time increment based on interval
    let timeIncrement;
    switch (interval) {
      case '1h': timeIncrement = 60 * 60 * 1000; break;
      case '1d': timeIncrement = 24 * 60 * 60 * 1000; break;
      case '7d': timeIncrement = 7 * 24 * 60 * 60 * 1000; break;
      case '30d': timeIncrement = 30 * 24 * 60 * 60 * 1000; break;
      default: timeIncrement = 24 * 60 * 60 * 1000; break;
    }
    
    // Generate price points
    let price = crypto.current_price;
    let timestamp = new Date();
    
    for (let i = 0; i < limit; i++) {
      // Move back in time
      timestamp = new Date(timestamp.getTime() - timeIncrement);
      
      // Generate a historical price with some volatility
      const volatility = 0.01 + (Math.random() * 0.02); // 1-3% volatility
      const direction = Math.random() > 0.5 ? 1 : -1;
      price = price * (1 + (direction * volatility));
      
      // Round appropriately
      price = parseFloat(price.toFixed(price < 1 ? 6 : 2));
      
      // Generate volume
      const volume = this.generateVolume(price);
      
      data.unshift({
        timestamp: timestamp,
        price: price,
        volume: volume
      });
    }
    
    return data;
  }
  
  private generateMarketCap(price: number): number {
    // Generate a realistic market cap based on price
    const multiplier = Math.pow(10, 6 + Math.floor(Math.random() * 6)); // Between 10^6 and 10^12
    return parseFloat((price * multiplier).toFixed(0));
  }
  
  private generateVolume(price: number): number {
    // Generate a realistic 24h volume based on price
    const multiplier = Math.pow(10, 4 + Math.floor(Math.random() * 4)); // Between 10^4 and 10^8
    return parseFloat((price * multiplier).toFixed(0));
  }
  
  private generateCirculatingSupply(symbol: string): number {
    // Generate realistic circulating supply based on the cryptocurrency
    switch (symbol) {
      case 'BTC': return 19_000_000 + Math.floor(Math.random() * 500_000);
      case 'ETH': return 120_000_000 + Math.floor(Math.random() * 1_000_000);
      case 'SOL': return 350_000_000 + Math.floor(Math.random() * 10_000_000);
      case 'DOGE': return 130_000_000_000 + Math.floor(Math.random() * 1_000_000_000);
      case 'ADA': return 35_000_000_000 + Math.floor(Math.random() * 1_000_000_000);
      default: return 1_000_000_000 + Math.floor(Math.random() * 1_000_000_000);
    }
  }
}

export const cryptoService = new CryptoService();
