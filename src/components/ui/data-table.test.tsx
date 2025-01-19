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
  });

  describe('Sorting', () => {
    const sortingProps = {
      sortBy: 'name',
      sortOrder: 'asc' as const,
      onSort: jest.fn(),
    };

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
  });

  describe('Filtering', () => {
    const filteringProps = {
      columnFilters: [],
      onColumnFiltersChange: jest.fn(),
    };

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
      render(
        <DataTable
          {...defaultProps}
          filtering={filteringProps}
        />,
      );

      const filterInputs = screen.getAllByRole('textbox');

      // Ensure that at least one filter input exists
      expect(filterInputs.length).toBeGreaterThan(0);

      // Use a non-null assertion to avoid the TypeScript error
      await userEvent.type(filterInputs[0]!, 'Alice');

      expect(filteringProps.onColumnFiltersChange).toHaveBeenCalled();
    });
  });
});
