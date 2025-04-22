/**
 * Cache Middleware
 * 
 * Express middleware that checks the cache before proceeding to the controller.
 * If a cached value is found, it returns that directly to save processing time.
 */

import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../services/cache-service';
import { loggerService } from '../services/logger-service';

export function cacheMiddleware(type: string = 'default') {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }
    
    // Skip cache if requested
    if (req.query.skip_cache === 'true') {
      return next();
    }
    
    const startTime = Date.now();
    
    // Generate cache key from URL path and query parameters
    const queryString = new URLSearchParams(req.query as Record<string, string>).toString();
    const cacheKey = `${req.path}${queryString ? `?${queryString}` : ''}`;
    
    try {
      // Check if we have a cached response
      const cachedData = await cacheService.get(cacheKey);
      
      if (cachedData) {
        // Log cached request
        const responseTime = Date.now() - startTime;
        await loggerService.logApiRequest({
          endpoint: req.path,
          method: req.method,
          status_code: 200,
          response_time: responseTime,
          cache_hit: true,
          timestamp: new Date(),
          user_agent: req.get('user-agent') || 'unknown',
          ip_address: req.ip
        });
        
        return res.json({
          success: true,
          source: 'cache',
          data: cachedData
        });
      }
      
      // Store the original res.json function
      const originalJson = res.json;
      
      // Override res.json to intercept the response
      res.json = function(body: any) {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300 && body && body.data) {
          // Cache the data
          cacheService.set(cacheKey, body.data, type);
        }
        
        // Call the original json method
        return originalJson.call(this, body);
      };
      
      next();
    } catch (error) {
      console.error(`Cache middleware error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      next();
    }
  };
}
