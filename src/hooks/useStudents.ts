import { useCallback, useEffect, useRef, useState } from 'react';

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

  // Use a ref to track if this is the initial mount
  const isInitialMount = useRef(true);
  // Use a ref to track if a fetch is in progress
  const isFetching = useRef(false);

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
    // Prevent concurrent fetches
    if (isFetching.current) {
      return;
    }

    setState((prev) => {
      if (prev.isLoading) {
        return prev;
      }

      // Start the fetch
      isFetching.current = true;

      // Use the current state values from the closure
      const fetchData = async () => {
        try {
          const response = await studentsApi.list(
            prev.filters,
            prev.pagination,
            prev.sort,
          );
          setState(p => ({
            ...p,
            students: response.data,
            pagination: {
              ...p.pagination,
              ...response.pagination,
            },
            isLoading: false,
          }));
        } catch (error) {
          handleApiError(error);
        } finally {
          isFetching.current = false;
        }
      };

      // Start the async operation
      fetchData();

      // Return the loading state
      return { ...prev, isLoading: true, error: null };
    });
  }, [handleApiError]); // Only depend on handleApiError

  // Fetch students when filters, pagination, or sort changes
  useEffect(() => {
    // Skip the initial fetch since we already have initialStudents
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchStudents();
    }, 300); // Debounce API calls

    return () => clearTimeout(timeoutId);
  }, [state.filters, state.pagination, state.sort, fetchStudents]);

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

  const handleDeleteSelected = useCallback(async () => {
    setState((prev) => {
      if (prev.selectedIds.length === 0 || prev.isLoading) {
        return prev;
      }

      const deleteData = async () => {
        try {
          await studentsApi.deleteMany(prev.selectedIds);
          await fetchStudents();
          setState(p => ({ ...p, selectedIds: [] }));
        } catch (error) {
          handleApiError(error);
        }
      };

      deleteData();
      return { ...prev, isLoading: true, error: null };
    });
  }, [fetchStudents, handleApiError]);

  return {
    ...state,
    setFilters,
    setPagination,
    setSort,
    toggleSelection,
    toggleAllSelection,
    deleteSelected: handleDeleteSelected,
    refresh: fetchStudents,
  };
}
