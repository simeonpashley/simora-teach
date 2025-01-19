import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import type { Student } from '@/api/students';
import { useStudents } from '@/contexts/useStudents';

import { StudentList } from './StudentList';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn().mockReturnValue((key: string) => key),
  useLocale: jest.fn().mockReturnValue('en'),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div className={className}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock useStudents hook
jest.mock('@/contexts/useStudents', () => ({
  useStudents: jest.fn(),
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

const mockUseStudents = {
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

describe('StudentList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useStudents as jest.Mock).mockReturnValue(mockUseStudents);
  });

  it('renders loading state', () => {
    (useStudents as jest.Mock).mockReturnValue({
      ...mockUseStudents,
      isLoading: true,
    });

    render(<StudentList />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useStudents as jest.Mock).mockReturnValue({
      ...mockUseStudents,
      error: new Error('Test error'),
    });

    render(<StudentList />);

    expect(screen.getByText('error_loading_students')).toBeInTheDocument();
  });

  it('renders student list with data', () => {
    render(<StudentList />);

    expect(screen.getByPlaceholderText('search_placeholder')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
  });

  it('handles search filter change', async () => {
    jest.useFakeTimers();
    render(<StudentList />);
    const searchInput = screen.getByPlaceholderText('search_placeholder');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    // Fast-forward past the debounce delay again
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(mockUseStudents.setFilters).toHaveBeenCalledWith({ search: 'John' });
    });
  });

  // it('handles status filter change', async () => {
  //   render(<StudentList />);
  //   const statusSelect = screen.getByRole('combobox');
  //   fireEvent.click(statusSelect);

  //   // Wait for the select content to be visible
  //   await waitFor(() => {
  //     const activeOptions = screen.getAllByText('status_active');

  //     expect(activeOptions.length).toBeGreaterThan(0); // Ensure options are rendered

  //     const activeOption = activeOptions[0];

  //     expect(activeOption).toBeInTheDocument();

  //     if (activeOption instanceof HTMLElement) {
  //       fireEvent.click(activeOption); // Click only if activeOption is a valid HTMLElement
  //     }
  //   });

  //   await waitFor(() => {
  //     expect(mockUseStudents.setFilters).toHaveBeenCalledWith({ status: 'active' });
  //   });
  // });

  it('shows selected actions when items are selected', () => {
    (useStudents as jest.Mock).mockReturnValue({
      ...mockUseStudents,
      selectedIds: [1],
    });

    render(<StudentList />);

    expect(screen.getByText('selected_count')).toBeInTheDocument();
    expect(screen.getByText('delete_selected')).toBeInTheDocument();
  });

  it('handles delete selected action', async () => {
    (useStudents as jest.Mock).mockReturnValue({
      ...mockUseStudents,
      selectedIds: [1],
    });

    render(<StudentList />);
    const deleteButton = screen.getByText('delete_selected');
    fireEvent.click(deleteButton);

    expect(mockUseStudents.deleteSelected).toHaveBeenCalled();
  });

  it('handles pagination changes', async () => {
    render(<StudentList />);

    // Mock pagination to enable next button
    (useStudents as jest.Mock).mockReturnValue({
      ...mockUseStudents,
      pagination: { page: 1, pageSize: 10, totalPages: 2 },
    });

    // Re-render with new mock
    render(<StudentList />);

    const nextPageButtons = screen.getAllByRole('button', { name: '>' });
    const nextPageButton = nextPageButtons[0]; // Access the first button

    if (nextPageButton) {
      fireEvent.click(nextPageButton); // Click only if nextPageButton is defined
    }

    await waitFor(() => {
      expect(mockUseStudents.setPagination).toHaveBeenCalledWith({ page: 2 });
    });
  });

  it('handles sort changes', async () => {
    render(<StudentList />);
    const nameHeader = screen.getByRole('button', { name: 'first_name' });
    fireEvent.click(nameHeader);

    await waitFor(() => {
      expect(mockUseStudents.setSort).toHaveBeenCalledWith({
        sortBy: 'firstName',
        sortOrder: 'desc',
      });
    });
  });

  it('debounces search input', async () => {
    jest.useFakeTimers();
    render(<StudentList />);

    const searchInput = screen.getByPlaceholderText('search_placeholder');

    // First change
    fireEvent.change(searchInput, { target: { value: 'Jo' } });

    // Fast-forward past the debounce delay
    jest.advanceTimersByTime(250);

    // Second change
    fireEvent.change(searchInput, { target: { value: 'John' } });

    // Fast-forward past the debounce delay again
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(mockUseStudents.setFilters).toHaveBeenCalledTimes(1);
      expect(mockUseStudents.setFilters).toHaveBeenCalledWith({
        search: 'John',
      });
    });

    jest.useRealTimers();
  });
});
