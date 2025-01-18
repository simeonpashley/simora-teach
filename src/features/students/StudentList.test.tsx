import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// Mock framer-motion as a manual mock
import React from 'react';

import type { Student } from '@/api/students';
import { useStudents } from '@/contexts/StudentsContext';

import { StudentList } from './StudentList';

// Mock modules before importing the component
jest.mock('@/contexts/StudentsContext', () => ({
  useStudents: jest.fn(),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: { children: React.ReactNode; className?: string }) =>
      React.createElement('div', { className }, children),
    button: ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) =>
      React.createElement('button', { className, onClick }, children),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}), { virtual: true });

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

describe('StudentList', () => {
  const mockContextValue = {
    students: mockStudents,
    isLoading: false,
    error: null,
    selectedIds: [],
    filters: {},
    pagination: { page: 1, pageSize: 10, totalPages: 1 },
    sort: { sortBy: 'firstName' as keyof Student, sortOrder: 'asc' as const },
    setFilters: jest.fn(),
    setPagination: jest.fn(),
    setSort: jest.fn(),
    toggleSelection: jest.fn(),
    toggleAllSelection: jest.fn(),
    deleteSelected: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    (useStudents as jest.Mock).mockReturnValue(mockContextValue);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the student list with data', () => {
    render(<StudentList />);

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Smith')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useStudents as jest.Mock).mockReturnValue({
      ...mockContextValue,
      isLoading: true,
    });

    render(<StudentList />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error state', () => {
    (useStudents as jest.Mock).mockReturnValue({
      ...mockContextValue,
      error: new Error('Failed to load students'),
    });

    render(<StudentList />);

    expect(screen.getByText('error_loading_students')).toBeInTheDocument();
  });

  it('handles search filter change', async () => {
    render(<StudentList />);

    const searchInput = screen.getByPlaceholderText('search_placeholder') as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(mockContextValue.setFilters).toHaveBeenCalledWith({
        search: 'John',
      });
    });
  });

  it('handles status filter change', async () => {
    render(<StudentList />);

    const statusSelect = screen.getByRole('combobox') as HTMLSelectElement;

    fireEvent.change(statusSelect, { target: { value: 'active' } });

    await waitFor(() => {
      expect(mockContextValue.setFilters).toHaveBeenCalledWith({
        status: 'active',
      });
    });
  });

  it('handles row selection', () => {
    render(<StudentList />);

    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes.length).toBeGreaterThan(1);

    const studentCheckbox = checkboxes[1];
    if (!studentCheckbox) {
      throw new Error('Student checkbox not found');
    }

    fireEvent.click(studentCheckbox);

    expect(mockContextValue.toggleSelection).toHaveBeenCalledWith(mockStudents[0]?.id);
  });

  it('handles select all', () => {
    render(<StudentList />);

    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes.length).toBeGreaterThan(0);

    const selectAllCheckbox = checkboxes[0] as HTMLInputElement;
    fireEvent.click(selectAllCheckbox);

    expect(mockContextValue.toggleAllSelection).toHaveBeenCalled();
  });

  it('shows selected actions when items are selected', () => {
    (useStudents as jest.Mock).mockReturnValue({
      ...mockContextValue,
      selectedIds: [1],
    });

    render(<StudentList />);

    expect(screen.getByText('selected_count')).toBeInTheDocument();
    expect(screen.getByText('delete_selected')).toBeInTheDocument();
  });

  it('handles delete selected action', () => {
    (useStudents as jest.Mock).mockReturnValue({
      ...mockContextValue,
      selectedIds: [1],
    });

    render(<StudentList />);

    const deleteButton = screen.getByText('delete_selected') as HTMLButtonElement;
    fireEvent.click(deleteButton);

    expect(mockContextValue.deleteSelected).toHaveBeenCalled();
  });
});
