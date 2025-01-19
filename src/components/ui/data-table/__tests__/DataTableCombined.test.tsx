import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DataTable } from '../';
import { columns, testData } from './test-utils';

describe('DataTable Combined Features', () => {
  const defaultProps = {
    data: testData,
    columns,
  };

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

  describe('Combined Filtering and Pagination', () => {
    const paginationProps = {
      totalRows: 15,
      pageIndex: 1,
      pageSize: 10,
      pageCount: 2,
      onPageSet: jest.fn(),
      onPageSizeChange: jest.fn(),
    };

    const filteringProps = {
      columnFilters: [],
      onColumnFiltersChange: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('resets to first page when filter changes', async () => {
      render(
        <DataTable
          {...defaultProps}
          pagination={paginationProps}
          filtering={filteringProps}
        />,
      );

      // Apply filter
      const filterInputs = screen.getAllByRole('textbox');
      await userEvent.type(filterInputs[0]!, 'alice');

      // Expect page to reset to 0
      expect(paginationProps.onPageSet).toHaveBeenCalledWith(0);
    });

    it.skip('maintains current page size when filtering', async () => {
      render(
        <DataTable
          {...defaultProps}
          pagination={paginationProps}
          filtering={filteringProps}
        />,
      );

      // Change page size
      const select = screen.getByTestId('rows-per-page-select-trigger');
      await userEvent.click(select);
      const option20 = screen.getByTestId('select-option-20');
      await userEvent.click(option20);

      // Apply filter
      const filterInputs = screen.getAllByRole('textbox');
      await userEvent.type(filterInputs[0]!, 'alice');

      expect(paginationProps.onPageSizeChange).toHaveBeenCalledWith(20);
      expect(screen.getByTestId('rows-per-page-select-trigger')).toHaveTextContent('20');
    });
  });

  describe('Combined Sorting and Pagination', () => {
    const paginationProps = {
      totalRows: 15,
      pageIndex: 1,
      pageSize: 10,
      pageCount: 2,
      onPageSet: jest.fn(),
      onPageSizeChange: jest.fn(),
    };

    const sortingProps = {
      sortBy: 'name',
      sortOrder: 'asc' as const,
      onSort: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it.skip('resets to first page when changing sort', async () => {
      render(
        <DataTable
          {...defaultProps}
          pagination={{
            ...paginationProps,
            onPageSet: jest.fn(),
          }}
          sorting={{
            sortBy: 'name',
            sortOrder: 'asc',
            onSort: jest.fn(),
          }}
        />,
      );

      // Simulate changing the sort
      const nameHeader = screen.getByRole('columnheader', { name: /Name/i });
      await userEvent.click(nameHeader);

      // We expect the page to reset to 0 when sorting changes
      expect(paginationProps.onPageSet).toHaveBeenCalledWith(0);
    });

    it.skip('maintains sort when changing page size', async () => {
      render(
        <DataTable
          {...defaultProps}
          pagination={paginationProps}
          sorting={sortingProps}
        />,
      );

      // Change page size
      const select = screen.getByTestId('rows-per-page-select-trigger');
      await userEvent.click(select);
      const option20 = screen.getByTestId('select-option-20');
      await userEvent.click(option20);

      const nameHeader = screen.getByRole('columnheader', { name: /Name/i });

      expect(nameHeader).toHaveTextContent('↑');
    });
  });
});
