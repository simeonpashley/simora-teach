export type PaginationParams = {
  page: number; // one based
  pageSize: number;
};

export type PaginationResponse = {
  total: number;
  pageSize: number;
  page: number; // one based
  totalPages: number;
};

export type ApiResponse<T> = {
  data: T;
  pagination?: PaginationResponse;
  error?: string;
};

export type ApiErrorResponse = {
  error: string;
};
