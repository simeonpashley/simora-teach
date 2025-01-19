import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DataTable } from './data-table';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Radix UI Select
jest.mock('@/components/ui/select', () => {
  let currentOnValueChange: ((value: string) => void) | undefined;

  return {
    Select: ({ children, value, onValueChange, 'data-testid': testId }: any) => {
      currentOnValueChange = onValueChange;
      return (
        <div data-testid={testId}>
          <button data-testid="select-trigger">{value}</button>
          {children}
        </div>
      );
    },
    SelectTrigger: ({ children }: any) => <div>{children}</div>,
    SelectValue: () => null,
    SelectContent: ({ children }: any) => <div role="listbox">{children}</div>,
    SelectItem: ({ children, value }: any) => (
      <button
        role="option"
        aria-selected="false"
        data-value={value}
        data-testid={`select-option-${value}`}
        onClick={() => currentOnValueChange?.(value)}
        onKeyDown={e => e.key === 'Enter' && currentOnValueChange?.(value)}
        tabIndex={0}
      >
        {children}
      </button>
    ),
  };
});

// Test data types
type TestData = {
  id: number;
  name: string;
  age: number;
};

// Test data
const testData: TestData[] = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 35 },
  { id: 4, name: 'David', age: 40 },
  { id: 5, name: 'Eve', age: 45 },
];

// Test columns
const columns: ColumnDef<TestData, any>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    cell: info => info.getValue(),
  },
  {
    id: 'age',
    accessorKey: 'age',
    header: 'Age',
    cell: info => info.getValue(),
  },
];

describe('DataTable', () => {
  const defaultProps = {
    data: testData,
    columns,
  };

  describe('Basic Rendering', () => {
    it('renders table with data', () => {
      render(<DataTable {...defaultProps} />);

      // Check headers
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();

      // Check data
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('displays no results message when data is empty', () => {
      render(<DataTable {...defaultProps} data={[]} noResults="No data available" />);

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    const paginationProps = {
      totalRows: 15,
      pageIndex: 0,
      pageSize: 10,
      pageCount: 2,
      onPageSet: jest.fn(),
      onPageSizeChange: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders pagination controls when pagination props are provided', () => {
      render(
        <DataTable
          {...defaultProps}
          pagination={paginationProps}
        />,
      );

      expect(screen.getByText('Rows per page')).toBeInTheDocument();
      expect(screen.getByTestId('select-trigger')).toHaveTextContent('10');
    });

    it('calls onPageSet when page is changed', async () => {
      render(
        <DataTable
          {...defaultProps}
          pagination={paginationProps}
        />,
      );

      const nextButton = screen.getByTestId('next-page');
      await userEvent.click(nextButton);

      expect(paginationProps.onPageSet).toHaveBeenCalledWith(1);
    });

    it('calls onPageSizeChange when rows per page is changed', async () => {
      render(
        <DataTable
          {...defaultProps}
          pagination={paginationProps}
        />,
      );

      const select = screen.getByTestId('rows-per-page-select');
      await userEvent.click(select);

      const option20 = screen.getByTestId('select-option-20');
      await userEvent.click(option20);

      expect(paginationProps.onPageSizeChange).toHaveBeenCalledWith(20);
    });

    it('disables previous/first page buttons on first page', () => {
      render(
        <DataTable
          {...defaultProps}
          pagination={{ ...paginationProps, pageIndex: 0 }}
        />,
      );

      expect(screen.getByTestId('first-page')).toBeDisabled();
      expect(screen.getByTestId('previous-page')).toBeDisabled();
      expect(screen.getByTestId('next-page')).toBeEnabled();
      expect(screen.getByTestId('last-page')).toBeEnabled();
    });

    it('disables next/last page buttons on last page', () => {
      render(
        <DataTable
          {...defaultProps}
          pagination={{ ...paginationProps, pageIndex: 1 }}
        />,
      );

      expect(screen.getByTestId('first-page')).toBeEnabled();
      expect(screen.getByTestId('previous-page')).toBeEnabled();
      expect(screen.getByTestId('next-page')).toBeDisabled();
      expect(screen.getByTestId('last-page')).toBeDisabled();
    });

    it('shows correct page information', () => {
      render(
        <DataTable
          {...defaultProps}
          pagination={{
            ...paginationProps,
            pageIndex: 1,
            pageSize: 5,
            totalRows: 12,
          }}
        />,
      );

      expect(screen.getByText('Showing 6 - 10 of 12 items')).toBeInTheDocument();
    });

    it('handles last page with partial results', () => {
      render(
        <DataTable
          {...defaultProps}
          pagination={{
            ...paginationProps,
            pageIndex: 2,
            pageSize: 5,
            totalRows: 12,
          }}
        />,
      );

      expect(screen.getByText('Showing 11 - 12 of 12 items')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    const sortingProps = {
      sortBy: 'name',
      sortOrder: 'asc' as const,
      onSort: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('displays sort indicators', () => {
      render(
        <DataTable
          {...defaultProps}
          sorting={sortingProps}
        />,
      );

      const nameHeader = screen.getByText('Name');

      expect(nameHeader.parentElement).toHaveTextContent('↑');
    });

    it('calls onSort when clicking sortable column', async () => {
      render(
        <DataTable
          {...defaultProps}
          sorting={sortingProps}
        />,
      );

      const nameHeader = screen.getByText('Name').closest('th');
      if (!nameHeader) {
        throw new Error('Header element not found');
      }
      await userEvent.click(nameHeader);

      expect(sortingProps.onSort).toHaveBeenCalledWith('name');
    });

    it('toggles sort direction when clicking the same column', async () => {
      render(
        <DataTable
          {...defaultProps}
          sorting={sortingProps}
        />,
      );

      const nameHeader = screen.getByText('Name').closest('th');
      if (!nameHeader) {
        throw new Error('Header element not found');
      }

      // First click - already asc, should trigger desc
      await userEvent.click(nameHeader);

      expect(sortingProps.onSort).toHaveBeenCalledWith('name');

      // Verify sort indicator
      expect(nameHeader).toHaveTextContent(/↑/);
    });

    it('shows no sort indicator for non-sortable columns', () => {
      const columnsWithNonSortable = [
        ...columns,
        {
          id: 'actions',
          header: 'Actions',
          enableSorting: false,
          cell: () => <button>Action</button>,
        },
      ];

      render(
        <DataTable
          data={testData}
          columns={columnsWithNonSortable}
          sorting={sortingProps}
        />,
      );

      const actionsHeader = screen.getByText('Actions').closest('th');
      if (!actionsHeader) {
        throw new Error('Actions header not found');
      }

      expect(actionsHeader).not.toHaveTextContent(/[↑↓]/);
    });
  });

  describe('Filtering', () => {
    const filteringProps = {
      columnFilters: [],
      onColumnFiltersChange: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders filter inputs when filtering is enabled', () => {
      render(
        <DataTable
          {...defaultProps}
          filtering={filteringProps}
        />,
      );

      const filterInputs = screen.getAllByRole('textbox');

      expect(filterInputs.length).toBeGreaterThan(0);
    });

    it('calls onColumnFiltersChange when filter value changes', async () => {
      let currentFilters: { id: string; value: string }[] = [];
      const onColumnFiltersChange = jest.fn().mockImplementation((updateFn: any) => {
        if (typeof updateFn === 'function') {
          currentFilters = updateFn(currentFilters);
        } else {
          currentFilters = updateFn;
        }
      });

      render(
        <DataTable
          {...defaultProps}
          filtering={{
            columnFilters: currentFilters,
            onColumnFiltersChange,
          }}
        />,
      );

      const filterInputs = screen.getAllByRole('textbox');

      expect(filterInputs.length).toBeGreaterThan(0);

      const firstInput = filterInputs[0];
      if (!firstInput) {
        throw new Error('Filter input not found');
      }

      await userEvent.type(firstInput, 'ali');

      expect(currentFilters).toEqual([
        { id: 'name', value: 'ali' },
      ]);
    });

    it('applies multiple filters simultaneously', async () => {
      let currentFilters: { id: string; value: string }[] = [];
      const onColumnFiltersChange = jest.fn().mockImplementation((updateFn: any) => {
        if (typeof updateFn === 'function') {
          currentFilters = updateFn(currentFilters);
        } else {
          currentFilters = updateFn;
        }
      });

      render(
        <DataTable
          {...defaultProps}
          filtering={{
            columnFilters: currentFilters,
            onColumnFiltersChange,
          }}
        />,
      );

      const filterInputs = screen.getAllByRole('textbox');

      expect(filterInputs.length).toBeGreaterThan(1);

      const nameInput = filterInputs[0];
      const ageInput = filterInputs[1];
      if (!nameInput || !ageInput) {
        throw new Error('Filter inputs not found');
      }

      // Filter by name
      await userEvent.type(nameInput, 'ali');

      expect(currentFilters).toEqual([
        { id: 'name', value: 'ali' },
      ]);

      // Filter by age
      await userEvent.type(ageInput, '25');

      expect(currentFilters).toEqual([
        { id: 'name', value: 'ali' },
        { id: 'age', value: '25' },
      ]);
    });

    it('clears filters when input is emptied', async () => {
      let currentFilters = [{ id: 'name', value: 'alice' }];
      const onColumnFiltersChange = jest.fn().mockImplementation((updateFn: any) => {
        if (typeof updateFn === 'function') {
          currentFilters = updateFn(currentFilters);
        } else {
          currentFilters = updateFn;
        }
      });

      render(
        <DataTable
          {...defaultProps}
          filtering={{
            columnFilters: currentFilters,
            onColumnFiltersChange,
          }}
        />,
      );

      const filterInputs = screen.getAllByRole('textbox');

      expect(filterInputs.length).toBeGreaterThan(0);

      const firstInput = filterInputs[0];
      if (!firstInput) {
        throw new Error('Filter input not found');
      }

      await userEvent.clear(firstInput);

      expect(currentFilters).toEqual([]);
    });

    it('shows no results message when filters match no data', () => {
      const noMatchData = testData.filter(item => item.name !== 'NoMatch');

      render(
        <DataTable
          {...defaultProps}
          data={noMatchData}
          filtering={{
            columnFilters: [{ id: 'name', value: 'NoMatch' }],
            onColumnFiltersChange: filteringProps.onColumnFiltersChange,
          }}
          noResults="No matching results"
        />,
      );

      expect(screen.getByText('No matching results')).toBeInTheDocument();
    });

    it('handles filter removal correctly', async () => {
      let currentFilters = [
        { id: 'name', value: 'alice' },
        { id: 'age', value: '25' },
      ];
      const onColumnFiltersChange = jest.fn().mockImplementation((updateFn: any) => {
        if (typeof updateFn === 'function') {
          currentFilters = updateFn(currentFilters);
        } else {
          currentFilters = updateFn;
        }
      });

      render(
        <DataTable
          {...defaultProps}
          filtering={{
            columnFilters: currentFilters,
            onColumnFiltersChange,
          }}
        />,
      );

      const filterInputs = screen.getAllByRole('textbox');

      expect(filterInputs.length).toBeGreaterThan(0);

      const firstInput = filterInputs[0];
      if (!(firstInput instanceof HTMLElement)) {
        throw new TypeError('Filter input not found or is not an HTMLElement');
      }

      await userEvent.clear(firstInput);

      expect(currentFilters).toEqual([
        { id: 'age', value: '25' },
      ]);
    });
  });

  describe('Combined Sorting and Filtering', () => {
    const sortingProps = {
      sortBy: 'name',
      sortOrder: 'asc' as const,
      onSort: jest.fn(),
    };

    const filteringProps = {
      columnFilters: [],
      onColumnFiltersChange: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('maintains filters when changing sort', async () => {
      render(
        <DataTable
          {...defaultProps}
          sorting={sortingProps}
          filtering={{
            ...filteringProps,
            columnFilters: [{ id: 'name', value: 'alice' }],
          }}
        />,
      );

      // Get the header by its role and content
      const headers = screen.getAllByRole('columnheader');
      const nameHeader = headers.find(header => header.textContent?.includes('Name'));
      if (!nameHeader) {
        throw new Error('Name header not found');
      }

      await userEvent.click(nameHeader);

      const filterInput = screen.getByDisplayValue('alice');
      if (!filterInput) {
        throw new Error('Filter input not found');
      }

      expect(sortingProps.onSort).toHaveBeenCalledWith('name');
      expect(filterInput).toBeInTheDocument();
    });

    it('maintains sort when changing filters', async () => {
      render(
        <DataTable
          {...defaultProps}
          sorting={sortingProps}
          filtering={filteringProps}
        />,
      );

      const filterInputs = screen.getAllByRole('textbox');
      const firstInput = filterInputs[0];
      if (!firstInput) {
        throw new Error('Filter input not found');
      }
      await userEvent.type(firstInput, 'alice');

      const nameHeader = screen.getByRole('columnheader', { name: /Name/i });
      if (!nameHeader) {
        throw new Error('Header element not found');
      }

      expect(nameHeader).toHaveTextContent('↑');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty data with filters and sorting', () => {
      render(
        <DataTable
          {...defaultProps}
          data={[]}
          sorting={{
            sortBy: 'name',
            sortOrder: 'asc',
            onSort: jest.fn(),
          }}
          filtering={{
            columnFilters: [{ id: 'name', value: 'test' }],
            onColumnFiltersChange: jest.fn(),
          }}
          noResults="No data available"
        />,
      );

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('handles undefined values in data', () => {
      type TestDataWithOptional = {
        id: number;
        name?: string;
        age?: number;
      };

      const dataWithUndefined: TestDataWithOptional[] = [
        { id: 1, name: undefined, age: 25 },
        { id: 2, name: 'Bob', age: undefined },
      ];

      const columnsWithOptionalValues: ColumnDef<TestDataWithOptional, any>[] = [
        {
          id: 'name',
          accessorFn: row => row.name ?? '',
          header: 'Name',
          cell: info => info.getValue() || '',
        },
        {
          id: 'age',
          accessorFn: row => row.age ?? '',
          header: 'Age',
          cell: info => info.getValue() || '',
        },
      ];

      render(
        <DataTable
          columns={columnsWithOptionalValues}
          data={dataWithUndefined}
          sorting={{
            sortBy: 'name',
            sortOrder: 'asc',
            onSort: jest.fn(),
          }}
        />,
      );

      expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('handles rapid filter changes', async () => {
      const onColumnFiltersChange = jest.fn();

      render(
        <DataTable
          {...defaultProps}
          filtering={{
            columnFilters: [],
            onColumnFiltersChange,
          }}
        />,
      );

      const filterInputs = screen.getAllByRole('textbox');
      const filterInput = filterInputs[0];
      if (!filterInput) {
        throw new Error('Filter input not found');
      }

      // Simulate rapid typing
      await userEvent.type(filterInput, 'test', { delay: 1 });

      // Each character should trigger a filter change
      expect(onColumnFiltersChange).toHaveBeenCalledTimes(4);
    });
  });
});
