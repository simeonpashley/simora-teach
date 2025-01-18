type ErrorType =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMIT'
  | 'SERVER_ERROR';

const ERROR_MESSAGES: Record<ErrorType, { dev: string; prod: string }> = {
  UNAUTHORIZED: {
    dev: 'Authentication required for this endpoint',
    prod: 'Unauthorized',
  },
  FORBIDDEN: {
    dev: 'You do not have permission to access this resource',
    prod: 'Forbidden',
  },
  NOT_FOUND: {
    dev: 'The requested resource was not found',
    prod: 'Not found',
  },
  VALIDATION_ERROR: {
    dev: 'Invalid request data',
    prod: 'Bad request',
  },
  RATE_LIMIT: {
    dev: 'Rate limit exceeded. Please try again later',
    prod: 'Too many requests',
  },
  SERVER_ERROR: {
    dev: 'An unexpected error occurred on the server',
    prod: 'Internal server error',
  },
};

export class ApiError extends Error {
  constructor(
    public type: ErrorType,
    public status: number,
    public details?: unknown,
  ) {
    const message = process.env.NODE_ENV === 'development'
      ? ERROR_MESSAGES[type].dev
      : ERROR_MESSAGES[type].prod;

    super(message);
    this.name = 'ApiError';
  }

  toResponse() {
    const response = {
      error: this.message,
      ...(process.env.NODE_ENV === 'development' && this.details
        ? { details: this.details }
        : {}),
    };

    return Response.json(response, { status: this.status });
  }

  static unauthorized(details?: unknown) {
    return new ApiError('UNAUTHORIZED', 401, details);
  }

  static forbidden(details?: unknown) {
    return new ApiError('FORBIDDEN', 403, details);
  }

  static notFound(details?: unknown) {
    return new ApiError('NOT_FOUND', 404, details);
  }

  static validation(details?: unknown) {
    return new ApiError('VALIDATION_ERROR', 400, details);
  }

  static rateLimit(details?: unknown) {
    return new ApiError('RATE_LIMIT', 429, details);
  }

  static server(details?: unknown) {
    return new ApiError('SERVER_ERROR', 500, details);
  }
}
