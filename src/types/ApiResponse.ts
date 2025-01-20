export type PaginationResponse = {
  total: number;
  pageSize: number;
  page: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  data: T;
  pagination?: PaginationResponse;
  error?: string;
  details?: unknown; // Only included in development mode
};

export type ApiErrorResponse = {
  error: string;
  details?: unknown; // Only included in development mode
};
