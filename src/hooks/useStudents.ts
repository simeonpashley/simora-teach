import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '@/api/base';
import type {
  Student,
  StudentFilters,
  StudentSortParams,
} from '@/api/students';
import { studentsApi } from '@/api/students';
import type { PaginationParams, PaginationResponse } from '@/api/types';

type UseStudentsState = {
  students: Student[];
  isLoading: boolean;
  error: Error | null;
  selectedIds: number[];
  filters: StudentFilters;
  pagination: PaginationParams & Partial<PaginationResponse>;
  sort: StudentSortParams;
};

const defaultPagination: PaginationParams = {
  page: 1,
  pageSize: 10,
};

const defaultSort: StudentSortParams = {
  sortBy: 'lastName',
  sortOrder: 'asc',
};

export function useStudents(initialStudents: Student[] = []) {
  const [state, setState] = useState<UseStudentsState>({
    students: initialStudents,
    isLoading: false,
    error: null,
    selectedIds: [],
    filters: {},
    pagination: defaultPagination,
    sort: defaultSort,
  });

  const handleApiError = useCallback((error: unknown) => {
    if (error instanceof ApiError) {
      // Auth errors are handled by the base client
      if (error.isAuthError) {
        return;
      }
      setState(prev => ({
        ...prev,
        error,
        isLoading: false,
      }));
    } else {
      setState(prev => ({
        ...prev,
        error: new Error('An unexpected error occurred'),
        isLoading: false,
      }));
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await studentsApi.getStudents(
        state.filters,
        state.pagination,
        state.sort,
      );
      setState(prev => ({
        ...prev,
        students: response,
        isLoading: false,
      }));
    } catch (error) {
      handleApiError(error);
    }
  }, [state.filters, state.pagination, state.sort, handleApiError]);

  // Fetch students when filters, pagination, or sort changes
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const setFilters = useCallback((filters: StudentFilters) => {
    setState(prev => ({
      ...prev,
      filters,
      // Reset to first page when filters change
      pagination: { ...prev.pagination, page: 1 },
    }));
  }, []);

  const setPagination = useCallback((pagination: Partial<PaginationParams>) => {
    setState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, ...pagination },
    }));
  }, []);

  const setSort = useCallback((sort: StudentSortParams) => {
    setState(prev => ({ ...prev, sort }));
  }, []);

  const toggleSelection = useCallback((id: number) => {
    setState(prev => ({
      ...prev,
      selectedIds: prev.selectedIds.includes(id)
        ? prev.selectedIds.filter(selectedId => selectedId !== id)
        : [...prev.selectedIds, id],
    }));
  }, []);

  const toggleAllSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedIds: prev.selectedIds.length === prev.students.length
        ? []
        : prev.students.map(student => student.id),
    }));
  }, []);

  const deleteSelected = useCallback(async () => {
    if (state.selectedIds.length === 0) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await studentsApi.deleteStudents(state.selectedIds);
      // Refresh the list after deletion
      await fetchStudents();
      // Clear selection
      setState(prev => ({ ...prev, selectedIds: [] }));
    } catch (error) {
      handleApiError(error);
    }
  }, [state.selectedIds, fetchStudents, handleApiError]);

  return {
    ...state,
    setFilters,
    setPagination,
    setSort,
    toggleSelection,
    toggleAllSelection,
    deleteSelected,
    refresh: fetchStudents,
  };
}
