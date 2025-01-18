import type { ApiErrorResponse, ApiResponse } from './types';

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isAuthError() {
    return this.status === 401;
  }
}

export abstract class BaseApiClient {
  constructor(protected baseUrl: string = '/api') {}

  protected async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      params,
    } = options;

    // Construct URL with query parameters
    const origin = typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const url = new URL(endpoint, origin + this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body) {
      requestOptions.body = JSON.stringify(body);
    }

    // Make request
    try {
      const response = await fetch(url, requestOptions);

      // Check if response is JSON before attempting to parse
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.warn('Received non-JSON response:', text);
        throw new ApiError(
          'Server returned non-JSON response',
          response.status,
          text,
        );
      }

      const data = await response.json() as ApiResponse<T> | ApiErrorResponse;

      if (!response.ok) {
        const error = new ApiError(
          (data as ApiErrorResponse).error || 'An error occurred',
          response.status,
          data,
        );

        // Handle authentication errors by redirecting to sign-in
        if (error.isAuthError && typeof window !== 'undefined') {
          const currentPath = window.location.pathname + window.location.search;
          const signInPath = `/sign-in?redirect_url=${encodeURIComponent(currentPath)}`;
          window.location.href = signInPath;
        }

        throw error;
      }

      return (data as ApiResponse<T>).data;
    } catch (error) {
      console.warn(`url:${url} requestOptions:`, requestOptions);
      console.error('error', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'An error occurred while making the request',
        500,
        error,
      );
    }
  }

  protected buildQueryParams(params: Record<string, unknown>): Record<string, string> {
    return Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>);
  }
}
