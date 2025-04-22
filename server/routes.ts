import express, { type Express } from 'express';
import compression from 'compression';
import { createServer, type Server } from 'http';
import { storage } from './storage';
import { cryptoService } from './services/crypto-service';
import { loggerService } from './services/logger-service';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { cacheMiddleware } from './middleware/cache-middleware';
import { standardLimiter, priceLimiter, historyLimiter } from './middleware/rate-limiter';
import * as cryptoController from './controllers/crypto-controller';

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply compression to all responses
  app.use(compression());
  
  // Create the API router
  const apiRouter = express.Router();
  
  // Apply rate limiting to all API routes
  apiRouter.use(standardLimiter.middleware());
  
  // Apply cache control headers
  apiRouter.use((req, res, next) => {
    res.set('Cache-Control', 'private, max-age=0, s-maxage=0');
    next();
  });
  
  // Price endpoints with higher rate limits
  apiRouter.get('/v1/prices', 
    priceLimiter.middleware(), 
    cacheMiddleware('prices'), 
    cryptoController.getAllPrices
  );
  
  apiRouter.get('/v1/prices/:symbol', 
    priceLimiter.middleware(), 
    cacheMiddleware('singlePrice'), 
    cryptoController.getPriceBySymbol
  );
  
  // Historical data endpoints with lower rate limits
  apiRouter.get('/v1/history/:symbol', 
    historyLimiter.middleware(), 
    cacheMiddleware('history'), 
    cryptoController.getHistoricalPrices
  );
  
  // Market data endpoints
  apiRouter.get('/v1/markets', 
    cacheMiddleware('markets'), 
    cryptoController.getMarketData
  );
  
  // Trending cryptocurrencies endpoint
  apiRouter.get('/v1/trending', 
    cacheMiddleware('trending'), 
    cryptoController.getTrendingCryptocurrencies
  );
  
  // System metrics endpoint (internal use)
  apiRouter.get('/v1/metrics', cryptoController.getPerformanceMetrics);
  
  // Mount API router at /api
  app.use('/api', apiRouter);
  
  // Apply 404 handler for undefined routes
  app.use('/api/*', notFoundHandler);
  
  // Apply error handler
  app.use(errorHandler);
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Initialize services
  // Warm up the cache with initial data
  setTimeout(() => {
    cryptoService.warmCache().catch(console.error);
  }, 1000);
  
  // Run periodic tasks
  // Update performance metrics every minute
  setInterval(() => {
    loggerService.updatePerformanceMetrics().catch(console.error);
  }, 60000);
  
  return httpServer;
}
