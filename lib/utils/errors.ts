/**
 * Error handling utilities
 */

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'AUTHENTICATION_ERROR')
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'AUTHORIZATION_ERROR')
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests', resetTime?: number) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED')
    this.name = 'RateLimitError'
    if (resetTime) {
      ;(this as any).resetTime = resetTime
    }
  }
}

/**
 * Log error with context (in production, send to error tracking service)
 */
export function logError(error: Error | unknown, context?: Record<string, unknown>) {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined

  console.error('Error:', {
    message: errorMessage,
    stack: errorStack,
    context,
    timestamp: new Date().toISOString(),
  })

  // In production, send to error tracking service (Sentry, LogRocket, etc.)
  // Example: Sentry.captureException(error, { extra: context })
}

/**
 * Format error response for API
 */
export function formatErrorResponse(error: Error | unknown) {
  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
    }
  }

  // Don't expose internal errors in production
  const isProduction = process.env.NODE_ENV === 'production'
  return {
    error: isProduction ? 'Internal server error' : error instanceof Error ? error.message : 'Unknown error',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
  }
}

