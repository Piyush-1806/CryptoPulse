/**
 * Error Handler Middleware
 * 
 * Centralized error handling for the application.
 * Provides consistent error responses and logs errors.
 */

import { Request, Response, NextFunction } from 'express';
import { loggerService } from '../services/logger-service';

export interface ApiError extends Error {
  status?: number;
  code?: string;
}

export function errorHandler(err: ApiError, req: Request, res: Response, next: NextFunction) {
  // Set default error status and message
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'server_error';
  
  // Log the error
  console.error(`Error ${status}: ${message}`, err.stack);
  
  // Log API request with error
  loggerService.logApiRequest({
    endpoint: req.path,
    method: req.method,
    status_code: status,
    response_time: 0, // Not measured for errors
    cache_hit: false,
    timestamp: new Date(),
    user_agent: req.get('user-agent') || 'unknown',
    ip_address: req.ip
  });
  
  // Send error response
  res.status(status).json({
    success: false,
    error: {
      code,
      message
    }
  });
}

/**
 * Creates a standard API error
 */
export function createApiError(message: string, status: number = 400, code: string = 'bad_request'): ApiError {
  const error = new Error(message) as ApiError;
  error.status = status;
  error.code = code;
  return error;
}

/**
 * Middleware to handle 404 errors for undefined routes
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  const error = createApiError(`Route not found: ${req.originalUrl}`, 404, 'not_found');
  next(error);
}
