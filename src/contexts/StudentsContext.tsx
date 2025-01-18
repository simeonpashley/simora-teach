'use client';

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ApiError } from '@/api/base';
import { studentsApi } from '@/api/students';

import type { StudentsContextType, StudentsState } from './students-context-types';
import { defaultPagination, defaultSort } from './students-context-types';

export const StudentsContext = createContext<StudentsContextType | null>(null);

// Debug helper
const debug = (area: string, message: string, data?: unknown) => {
  console.log(`[StudentsContext:${area}]`, message, data ? JSON.stringify(data, null, 2) : '');
};

export function StudentsProvider({ children }: PropsWithChildren) {
  debug('render', 'Provider rendering');

  const [students, setStudents] = useState<StudentsState['students']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [filters, setFiltersState] = useState<StudentsState['filters']>({});
  const [pagination, setPaginationState] = useState(defaultPagination);
  const [sort, setSortState] = useState(defaultSort);

  const isInitialMount = useRef(true);
  const isFetching = useRef(false);
  const currentRequestRef = useRef({ filters, pagination, sort });
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    debug('lifecycle', `Render count: ${renderCount.current}`);
  });

  const handleApiError = useCallback((error: unknown) => {
    debug('error', 'API Error:', { error, stack: error instanceof Error ? error.stack : undefined });
    if (error instanceof ApiError) {
      if (error.isAuthError) {
        return;
      }
      setError(error);
    } else {
      setError(new Error('An unexpected error occurred'));
    }
    setIsLoading(false);
  }, []);

  const fetchStudents = useCallback(async () => {
    if (isFetching.current) {
      debug('fetch', 'Skipping fetch - already in progress');
      return;
    }

    const request = currentRequestRef.current;
    debug('fetch', 'Starting fetch with params:', request);
    isFetching.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await studentsApi.list(
        request.filters,
        request.pagination,
        request.sort,
      );
      debug('fetch', 'Raw API response:', response);

      // Handle both array responses and structured responses
      if (Array.isArray(response)) {
        setStudents(response);
        debug('fetch', 'State updated with array response', {
          studentsCount: response.length,
        });
      } else if (response && typeof response === 'object') {
        if (!response.data) {
          throw new Error('Invalid API response structure - missing data property');
        }
        setStudents(response.data);
        if (response.pagination) {
          setPaginationState(prev => ({ ...prev, ...response.pagination }));
        }
        debug('fetch', 'State updated with structured response', {
          studentsCount: response.data.length,
          pagination: response.pagination,
        });
      } else {
        throw new Error('Invalid API response structure - expected array or object with data property');
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, [handleApiError]);

  // Update request params ref
  const updateRequestParams = useCallback(() => {
    const newParams = { filters, pagination, sort };
    debug('params', 'Updating request params:', {
      current: currentRequestRef.current,
      new: newParams,
      changed: JSON.stringify(currentRequestRef.current) !== JSON.stringify(newParams),
    });
    currentRequestRef.current = newParams;
  }, [filters, pagination, sort]);

  useEffect(() => {
    updateRequestParams();
  }, [updateRequestParams]);

  useEffect(() => {
    if (isInitialMount.current) {
      debug('lifecycle', 'Initial mount - fetching data');
      isInitialMount.current = false;
      fetchStudents();
      return;
    }

    debug('lifecycle', 'Setting up debounced fetch');
    const timeoutId = setTimeout(fetchStudents, 300);
    return () => {
      debug('lifecycle', 'Cleaning up debounced fetch');
      clearTimeout(timeoutId);
    };
  }, [filters, pagination, sort, fetchStudents]);

  const setFilters = useCallback((newFilters: StudentsState['filters']) => {
    debug('filters', 'Setting new filters:', newFilters);
    setFiltersState(newFilters);
    setPaginationState(prev => ({ ...prev, page: 1 }));
  }, []);

  const setPagination = useCallback((newPagination: Partial<StudentsState['pagination']>) => {
    debug('pagination', 'Setting new pagination:', newPagination);
    setPaginationState(prev => ({ ...prev, ...newPagination }));
  }, []);

  const setSort = useCallback((newSort: StudentsState['sort']) => {
    debug('sort', 'Setting new sort:', newSort);
    setSortState(newSort);
  }, []);

  const toggleSelection = useCallback((id: number) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id],
    );
  }, []);

  const toggleAllSelection = useCallback(() => {
    setSelectedIds(prev =>
      prev.length === students.length
        ? []
        : students.map(student => student.id),
    );
  }, [students]);

  const handleDeleteSelected = useCallback(async () => {
    if (selectedIds.length === 0 || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await studentsApi.deleteMany(selectedIds);
      await fetchStudents();
      setSelectedIds([]);
    } catch (error) {
      handleApiError(error);
    }
  }, [selectedIds, isLoading, fetchStudents, handleApiError]);

  const value = useMemo(() => {
    debug('context', 'Creating new context value', {
      studentsCount: students.length,
      isLoading,
      hasError: !!error,
      selectedCount: selectedIds.length,
    });
    return {
      students,
      isLoading,
      error,
      selectedIds,
      filters,
      pagination,
      sort,
      setFilters,
      setPagination,
      setSort,
      toggleSelection,
      toggleAllSelection,
      deleteSelected: handleDeleteSelected,
      refresh: fetchStudents,
    };
  }, [
    students,
    isLoading,
    error,
    selectedIds,
    filters,
    pagination,
    sort,
    setFilters,
    setPagination,
    setSort,
    toggleSelection,
    toggleAllSelection,
    handleDeleteSelected,
    fetchStudents,
  ]);

  return (
    <StudentsContext.Provider value={value}>
      {children}
    </StudentsContext.Provider>
  );
}
