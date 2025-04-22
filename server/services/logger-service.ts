import { storage } from '../storage';
import { type InsertApiLog } from '@shared/schema';

class LoggerService {
  private responseTimeData: number[] = [];
  private cacheHits: number = 0;
  private cacheMisses: number = 0;
  private totalRequests: number = 0;
  private errorCount: number = 0;

  async logApiRequest(log: InsertApiLog): Promise<void> {
    try {
      await storage.createApiLog(log);
      
      // Update metrics
      this.totalRequests++;
      this.responseTimeData.push(log.response_time);
      if (log.cache_hit) {
        this.cacheHits++;
      } else {
        this.cacheMisses++;
      }
      
      if (log.status_code >= 400) {
        this.errorCount++;
      }

      // Every 100 requests, update performance metrics
      if (this.totalRequests % 100 === 0) {
        this.updatePerformanceMetrics();
      }
    } catch (error) {
      console.error('Error logging API request:', error);
    }
  }

  async updatePerformanceMetrics(): Promise<void> {
    try {
      if (this.responseTimeData.length === 0) return;

      const avgResponseTime = Math.round(
        this.responseTimeData.reduce((sum, time) => sum + time, 0) / this.responseTimeData.length
      );
      
      const totalRequests = this.cacheHits + this.cacheMisses;
      const cacheHitRate = totalRequests > 0 ? (this.cacheHits / totalRequests) * 100 : 0;
      
      // Calculate requests per second based on last minute
      const requestsPerSecond = this.totalRequests / 60; // Simplified calculation
      
      const errorRate = this.totalRequests > 0 ? (this.errorCount / this.totalRequests) * 100 : 0;

      await storage.createPerformanceMetric({
        avg_response_time: avgResponseTime,
        cache_hit_rate: cacheHitRate,
        requests_per_second: requestsPerSecond,
        error_rate: errorRate,
        timestamp: new Date()
      });

      // Reset the counters after creating metrics
      this.resetCounters();
    } catch (error) {
      console.error('Error updating performance metrics:', error);
    }
  }

  getLatestMetrics(): { 
    avgResponseTime: number, 
    cacheHitRate: number, 
    requestsPerSecond: number, 
    errorRate: number 
  } {
    const avgResponseTime = this.responseTimeData.length > 0 
      ? Math.round(this.responseTimeData.reduce((sum, time) => sum + time, 0) / this.responseTimeData.length) 
      : 0;
    
    const totalRequests = this.cacheHits + this.cacheMisses;
    const cacheHitRate = totalRequests > 0 ? (this.cacheHits / totalRequests) * 100 : 0;
    
    // Calculate requests per second based on last minute
    const requestsPerSecond = this.totalRequests / 60; // Simplified calculation
    
    const errorRate = this.totalRequests > 0 ? (this.errorCount / this.totalRequests) * 100 : 0;

    return {
      avgResponseTime,
      cacheHitRate,
      requestsPerSecond,
      errorRate
    };
  }

  private resetCounters(): void {
    // Keep only the last 1000 response times for rolling average
    if (this.responseTimeData.length > 1000) {
      this.responseTimeData = this.responseTimeData.slice(-1000);
    }
    
    // Reset counters but maintain last 100 requests for continuous metrics
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.totalRequests = 0;
    this.errorCount = 0;
  }
}

export const loggerService = new LoggerService();
