export type PaginationParams = {
  page: number;
  pageSize: number;
};

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
};

export type ApiErrorResponse = {
  error: string;
};
