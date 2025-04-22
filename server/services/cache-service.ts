/**
 * Cache Service
 * 
 * Provides memory-based caching functionality to reduce external API calls.
 * Implements Redis-like functionality with in-memory storage.
 */

import { storage } from '../storage';

interface CacheItem {
  data: any;
  expiresAt: Date;
}

class CacheService {
  private cache: Map<string, CacheItem>;
  private defaultTTL: number;
  private ttlConfig: Record<string, number>;

  constructor() {
    this.cache = new Map();
    // Default TTL in seconds
    this.defaultTTL = 60;
    
    // TTL configurations for different data types (in seconds)
    this.ttlConfig = {
      prices: 30,         // 30 seconds
      singlePrice: 15,    // 15 seconds
      history: 300,       // 5 minutes
      markets: 120,       // 2 minutes
      trending: 600      // 10 minutes
    };
    
    // Set up periodic cache cleanup
    setInterval(() => this.cleanupExpiredCache(), 60000); // Run every minute
  }
  
  /**
   * Get a value from cache
   * @param key The cache key
   * @returns The cached value or null if not found or expired
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      // First check the in-memory cache for fastest access
      const cachedItem = this.cache.get(key);
      if (cachedItem && cachedItem.expiresAt > new Date()) {
        // Track cache hit in storage
        await storage.incrementCacheHits(key);
        return cachedItem.data as T;
      }
      
      // If not in memory, clear it if it exists
      if (cachedItem) {
        this.cache.delete(key);
      }
      
      return null;
    } catch (error) {
      console.error(`Cache get error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }
  
  /**
   * Set a value in cache
   * @param key The cache key
   * @param data The data to cache
   * @param type Cache type to determine TTL
   * @returns True if successful, false otherwise
   */
  async set(key: string, data: any, type: string = 'default'): Promise<boolean> {
    try {
      const ttl = this.ttlConfig[type] || this.defaultTTL;
      const expiresAt = new Date(Date.now() + ttl * 1000);
      
      // Store in memory cache
      this.cache.set(key, {
        data,
        expiresAt
      });
      
      // Track in storage
      await storage.createCacheEntry({
        key,
        expires_at: expiresAt
      });
      
      return true;
    } catch (error) {
      console.error(`Cache set error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }
  
  /**
   * Delete a value from cache
   * @param key The cache key to delete
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * Delete all cache entries that match a pattern
   * @param pattern The key pattern to invalidate
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Get cache statistics
   */
  getStats(): { size: number, keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
  
  /**
   * Remove expired items from cache
   */
  private cleanupExpiredCache(): void {
    const now = new Date();
    let expiredCount = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (item.expiresAt <= now) {
        this.cache.delete(key);
        expiredCount++;
      }
    }
    
    if (expiredCount > 0) {
      console.log(`Cleaned up ${expiredCount} expired cache entries`);
    }
    
    // Also clean up in storage
    storage.cleanExpiredCache();
  }
}

export const cacheService = new CacheService();
