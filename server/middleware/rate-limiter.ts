/**
 * Rate Limiter Middleware
 * 
 * Limits the number of requests a client can make within a specific time window.
 * Helps to protect the API from abuse and ensures fair usage.
 */

import { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private windowMs: number;
  private maxRequests: number;
  private clients: Map<string, RateLimitEntry>;
  
  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.clients = new Map();
    
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }
  
  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Get client identifier (IP address or API key if available)
      const clientId = req.get('x-api-key') || req.ip;
      
      // Get current time
      const now = Date.now();
      
      // Get or create client entry
      const clientEntry = this.clients.get(clientId) || {
        count: 0,
        resetTime: now + this.windowMs
      };
      
      // Check if time window has passed and reset if needed
      if (now > clientEntry.resetTime) {
        clientEntry.count = 0;
        clientEntry.resetTime = now + this.windowMs;
      }
      
      // Increment request count
      clientEntry.count++;
      
      // Update client record
      this.clients.set(clientId, clientEntry);
      
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', this.maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - clientEntry.count));
      res.setHeader('X-RateLimit-Reset', Math.ceil(clientEntry.resetTime / 1000));
      
      // Check if rate limit is exceeded
      if (clientEntry.count > this.maxRequests) {
        // Calculate time until reset
        const retryAfter = Math.ceil((clientEntry.resetTime - now) / 1000);
        
        res.setHeader('Retry-After', retryAfter);
        
        return res.status(429).json({
          success: false,
          error: {
            code: 'rate_limit_exceeded',
            message: `Rate limit exceeded. Try again in ${retryAfter} seconds`,
            retry_after: retryAfter
          }
        });
      }
      
      next();
    };
  }
  
  private cleanup() {
    const now = Date.now();
    for (const [clientId, entry] of this.clients.entries()) {
      if (now > entry.resetTime) {
        this.clients.delete(clientId);
      }
    }
  }
}

// Create different instances for different route groups
export const standardLimiter = new RateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes
export const priceLimiter = new RateLimiter(60 * 1000, 120); // 120 requests per minute for price endpoints
export const historyLimiter = new RateLimiter(60 * 1000, 20); // 20 requests per minute for historical data
