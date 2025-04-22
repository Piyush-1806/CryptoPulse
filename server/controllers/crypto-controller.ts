/**
 * Cryptocurrency Controller
 * 
 * Handles all API endpoints for cryptocurrency data
 */

import { Request, Response, NextFunction } from 'express';
import { cryptoService } from '../services/crypto-service';
import { createApiError } from '../middleware/error-handler';
import { z } from 'zod';

// Input validation schemas
const currencySchema = z.string().toUpperCase().length(3).default('USD');
const limitSchema = z.coerce.number().int().min(1).max(1000).default(100);
const symbolSchema = z.string().toUpperCase().min(1).max(10);
const intervalSchema = z.enum(['1h', '1d', '7d', '30d', '90d', '1y']).default('1d');
const skipCacheSchema = z.enum(['true', 'false']).optional().transform(val => val === 'true');

/**
 * Get all cryptocurrency prices
 */
export async function getAllPrices(req: Request, res: Response, next: NextFunction) {
  try {
    // Validate query parameters
    const result = z.object({
      currency: currencySchema,
      skip_cache: skipCacheSchema
    }).safeParse(req.query);
    
    if (!result.success) {
      throw createApiError('Invalid query parameters', 400, 'validation_error');
    }
    
    const { currency } = result.data;
    
    const startTime = Date.now();
    const prices = await cryptoService.getAllPrices(currency);
    const responseTime = Date.now() - startTime;
    
    res.json({
      success: true,
      source: 'api',
      data: prices,
      metadata: {
        count: prices.length,
        currency
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get price for a specific cryptocurrency
 */
export async function getPriceBySymbol(req: Request, res: Response, next: NextFunction) {
  try {
    // Get symbol from URL parameter
    const { symbol } = req.params;
    
    // Validate parameters
    const symbolResult = symbolSchema.safeParse(symbol);
    if (!symbolResult.success) {
      throw createApiError('Invalid cryptocurrency symbol', 400, 'validation_error');
    }
    
    // Validate query parameters
    const queryResult = z.object({
      currency: currencySchema,
      skip_cache: skipCacheSchema
    }).safeParse(req.query);
    
    if (!queryResult.success) {
      throw createApiError('Invalid query parameters', 400, 'validation_error');
    }
    
    const { currency } = queryResult.data;
    
    const startTime = Date.now();
    const price = await cryptoService.getPriceBySymbol(symbol, currency);
    const responseTime = Date.now() - startTime;
    
    if (!price) {
      throw createApiError(`Cryptocurrency with symbol '${symbol}' not found`, 404, 'resource_not_found');
    }
    
    res.json({
      success: true,
      source: 'api',
      data: price
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get historical price data for a cryptocurrency
 */
export async function getHistoricalPrices(req: Request, res: Response, next: NextFunction) {
  try {
    // Get symbol from URL parameter
    const { symbol } = req.params;
    
    // Validate parameters
    const symbolResult = symbolSchema.safeParse(symbol);
    if (!symbolResult.success) {
      throw createApiError('Invalid cryptocurrency symbol', 400, 'validation_error');
    }
    
    // Validate query parameters
    const queryResult = z.object({
      interval: intervalSchema,
      limit: limitSchema,
      currency: currencySchema,
      skip_cache: skipCacheSchema
    }).safeParse(req.query);
    
    if (!queryResult.success) {
      throw createApiError('Invalid query parameters', 400, 'validation_error');
    }
    
    const { interval, limit, currency } = queryResult.data;
    
    const startTime = Date.now();
    const historicalData = await cryptoService.getHistoricalPrices(symbol, interval, limit);
    const responseTime = Date.now() - startTime;
    
    if (historicalData.length === 0) {
      throw createApiError(`Historical data for symbol '${symbol}' not found`, 404, 'resource_not_found');
    }
    
    res.json({
      success: true,
      source: 'api',
      data: historicalData,
      metadata: {
        symbol,
        interval,
        dataPoints: historicalData.length,
        currency
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get market data for all cryptocurrencies
 */
export async function getMarketData(req: Request, res: Response, next: NextFunction) {
  try {
    // Validate query parameters
    const queryResult = z.object({
      limit: limitSchema,
      currency: currencySchema,
      skip_cache: skipCacheSchema
    }).safeParse(req.query);
    
    if (!queryResult.success) {
      throw createApiError('Invalid query parameters', 400, 'validation_error');
    }
    
    const { limit, currency } = queryResult.data;
    
    const startTime = Date.now();
    const marketData = await cryptoService.getMarketData(currency, limit);
    const responseTime = Date.now() - startTime;
    
    res.json({
      success: true,
      source: 'api',
      data: marketData,
      metadata: {
        count: marketData.length,
        currency
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get trending cryptocurrencies
 */
export async function getTrendingCryptocurrencies(req: Request, res: Response, next: NextFunction) {
  try {
    // Validate query parameters
    const queryResult = z.object({
      limit: z.coerce.number().int().min(1).max(20).default(5),
      skip_cache: skipCacheSchema
    }).safeParse(req.query);
    
    if (!queryResult.success) {
      throw createApiError('Invalid query parameters', 400, 'validation_error');
    }
    
    const { limit } = queryResult.data;
    
    const startTime = Date.now();
    const trendingCryptos = await cryptoService.getTrendingCryptocurrencies(limit);
    const responseTime = Date.now() - startTime;
    
    res.json({
      success: true,
      source: 'api',
      data: trendingCryptos,
      metadata: {
        count: trendingCryptos.length
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get system performance metrics
 */
export async function getPerformanceMetrics(req: Request, res: Response, next: NextFunction) {
  try {
    const metrics = await cryptoService.getPerformanceMetrics();
    
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    next(error);
  }
}
