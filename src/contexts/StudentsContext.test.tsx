import { act, renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';

import type { Student } from '@/api/students';
import { studentsApi } from '@/api/students';

import { StudentsProvider } from './StudentsContext';
import { useStudents } from './useStudents';

// Mock the students API
jest.mock('@/api/students', () => ({
  studentsApi: {
    list: jest.fn(),
    deleteMany: jest.fn(),
  },
}));

const mockStudents: Student[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    status: 'active',
    dateOfBirth: new Date('1990-01-01'),
    enrollmentDate: new Date('2024-01-01'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    status: 'inactive',
    dateOfBirth: new Date('1991-01-01'),
    enrollmentDate: new Date('2024-01-01'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const wrapper = ({ children }: PropsWithChildren) => (
  <StudentsProvider>{children}</StudentsProvider>
);

describe('StudentsContext', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    (studentsApi.list as jest.Mock).mockResolvedValue({
      data: mockStudents,
      pagination: { page: 1, pageSize: 10, totalPages: 1 },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('provides initial state', async () => {
    const { result } = renderHook(() => useStudents(), { wrapper });

    await waitFor(() => {
      expect(result.current.students).toEqual(mockStudents);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.selectedIds).toEqual([]);
    expect(result.current.filters).toEqual({});
    expect(result.current.pagination).toEqual(expect.objectContaining({
      page: 1,
      pageSize: 10,
    }));
  });

  it('handles API errors', async () => {
    const error = new Error('Failed to fetch students');
    (studentsApi.list as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useStudents(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.students).toEqual([]);
  });

  it('updates filters and refetches data', async () => {
    const { result } = renderHook(() => useStudents(), { wrapper });

    await waitFor(() => {
      expect(result.current.students).toEqual(mockStudents);
    });

    const filters = { search: 'John', status: 'active' };
    act(() => {
      result.current.setFilters(filters);
    });

    await waitFor(() => {
      expect(studentsApi.list).toHaveBeenCalledWith(
        filters,
        expect.any(Object),
        expect.any(Object),
      );
    });
  });

  it('updates pagination and refetches data', async () => {
    const { result } = renderHook(() => useStudents(), { wrapper });

    await waitFor(() => {
      expect(result.current.students).toEqual(mockStudents);
    });

    const newPagination = { page: 2, pageSize: 20 };
    act(() => {
      result.current.setPagination(newPagination);
    });

    await waitFor(() => {
      expect(studentsApi.list).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining(newPagination),
        expect.any(Object),
      );
    });
  });

  it('updates sort and refetches data', async () => {
    const { result } = renderHook(() => useStudents(), { wrapper });

    await waitFor(() => {
      expect(result.current.students).toEqual(mockStudents);
    });

    const newSort = { sortBy: 'lastName' as keyof Student, sortOrder: 'desc' as const };
    act(() => {
      result.current.setSort(newSort);
    });

    await waitFor(() => {
      expect(studentsApi.list).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        newSort,
      );
    });
  });

  it('handles row selection', async () => {
    const { result } = renderHook(() => useStudents(), { wrapper });

    await waitFor(() => {
      expect(result.current.students).toEqual(mockStudents);
    });

    act(() => {
      result.current.toggleSelection(1);
    });

    expect(result.current.selectedIds).toEqual([1]);

    act(() => {
      result.current.toggleSelection(1);
    });

    expect(result.current.selectedIds).toEqual([]);
  });

  it('handles select all', async () => {
    const { result } = renderHook(() => useStudents(), { wrapper });

    await waitFor(() => {
      expect(result.current.students).toEqual(mockStudents);
    });

    act(() => {
      result.current.toggleAllSelection();
    });

    expect(result.current.selectedIds).toEqual([1, 2]);

    act(() => {
      result.current.toggleAllSelection();
    });

    expect(result.current.selectedIds).toEqual([]);
  });

  it('handles delete selected', async () => {
    const { result } = renderHook(() => useStudents(), { wrapper });

    await waitFor(() => {
      expect(result.current.students).toEqual(mockStudents);
    });

    act(() => {
      result.current.toggleSelection(1);
      result.current.toggleSelection(2);
    });

    (studentsApi.deleteMany as jest.Mock).mockResolvedValue(undefined);
    (studentsApi.list as jest.Mock).mockResolvedValue({
      data: [mockStudents[1]],
      pagination: { page: 1, pageSize: 10, totalPages: 1 },
    });

    await act(async () => {
      await result.current.deleteSelected();
    });

    expect(studentsApi.deleteMany).toHaveBeenCalledWith([1, 2]);
    expect(result.current.selectedIds).toEqual([]);
  });

  it('handles delete selected error', async () => {
    const { result } = renderHook(() => useStudents(), { wrapper });

    await waitFor(() => {
      expect(result.current.students).toEqual(mockStudents);
    });

    act(() => {
      result.current.toggleSelection(1);
    });

    const error = new Error('Failed to delete students');
    (studentsApi.deleteMany as jest.Mock).mockRejectedValue(error);

    await act(async () => {
      await result.current.deleteSelected();
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.selectedIds).toEqual([1]);
  });

  it('handles concurrent filter and pagination updates', async () => {
    const { result } = renderHook(() => useStudents(), { wrapper });

    await waitFor(() => {
      expect(result.current.students).toEqual(mockStudents);
    });

    act(() => {
      result.current.setFilters({ search: 'John' });
      result.current.setPagination({ page: 2, pageSize: 10 });
    });

    await waitFor(() => {
      expect(studentsApi.list).toHaveBeenCalledWith(
        { search: 'John' },
        expect.objectContaining({ page: 2, pageSize: 10 }),
        expect.any(Object),
      );
    });
  });

  it('recovers from error state on successful refresh', async () => {
    const error = new Error('Failed to fetch students');
    (studentsApi.list as jest.Mock)
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce({
        data: mockStudents,
        pagination: { page: 1, pageSize: 10, totalPages: 1 },
      });

    const { result } = renderHook(() => useStudents(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.error).toBe(null);
    expect(result.current.students).toEqual(mockStudents);
  });

  it('maintains selection state across page changes', async () => {
    const { result } = renderHook(() => useStudents(), { wrapper });

    await waitFor(() => {
      expect(result.current.students).toEqual(mockStudents);
    });

    act(() => {
      result.current.toggleSelection(1);
    });

    const page2Students = [
      { ...mockStudents[0], id: 3 },
      { ...mockStudents[1], id: 4 },
    ];

    (studentsApi.list as jest.Mock).mockResolvedValueOnce({
      data: page2Students,
      pagination: { page: 2, pageSize: 10, totalPages: 2 },
    });

    act(() => {
      result.current.setPagination({ page: 2, pageSize: 10 });
    });

    await waitFor(() => {
      expect(result.current.students).toEqual(page2Students);
    });

    expect(result.current.selectedIds).toContain(1);
  });

  it('clears error state when changing filters', async () => {
    const error = new Error('Failed to fetch students');
    (studentsApi.list as jest.Mock)
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce({
        data: mockStudents,
        pagination: { page: 1, pageSize: 10, totalPages: 1 },
      });

    const { result } = renderHook(() => useStudents(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    act(() => {
      result.current.setFilters({ search: 'New' });
    });

    await waitFor(() => {
      expect(result.current.error).toBe(null);
      expect(result.current.students).toEqual(mockStudents);
    });
  });
});
