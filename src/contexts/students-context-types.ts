import type { Student, StudentFilters, StudentSortParams } from '@/api/students';
import type { PaginationParams, PaginationResponse } from '@/api/types';

export type StudentsState = {
  students: Student[];
  isLoading: boolean;
  error: Error | null;
  selectedIds: number[];
  filters: StudentFilters;
  pagination: PaginationParams & Partial<PaginationResponse>;
  sort: StudentSortParams;
};

export type StudentsContextType = StudentsState & {
  setFilters: (filters: StudentFilters) => void;
  setPagination: (pagination: Partial<PaginationParams>) => void;
  setSort: (sort: StudentSortParams) => void;
  toggleSelection: (id: number) => void;
  toggleAllSelection: () => void;
  deleteSelected: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const defaultPagination: PaginationParams = {
  page: 1,
  pageSize: 10,
};

export const defaultSort: StudentSortParams = {
  sortBy: 'lastName',
  sortOrder: 'asc',
};

export const defaultState: StudentsState = {
  students: [],
  isLoading: false,
  error: null,
  selectedIds: [],
  filters: {},
  pagination: defaultPagination,
  sort: defaultSort,
};
