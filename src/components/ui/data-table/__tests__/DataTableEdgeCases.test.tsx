import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';

import { DataTable } from '../';
import { columns, testData } from './test-utils';

describe('DataTable Edge Cases', () => {
  const defaultProps = {
    data: testData,
    columns,
  };

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
      id: string;
      name?: string;
      age?: number;
    };

    const dataWithUndefined: TestDataWithOptional[] = [
      { id: 'uuid-1', name: undefined, age: 25 },
      { id: 'uuid-2', name: 'Bob', age: undefined },
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

  it('handles empty data with selection', () => {
    render(
      <DataTable
        {...defaultProps}
        data={[]}
        selection={{
          selectedRows: new Set(),
          onSelectedRowsChange: jest.fn(),
        }}
        noResults="No data available"
      />,
    );

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('handles data with missing required fields', () => {
    type TestDataWithRequired = {
      id: string;
      name: string;
      age: number;
    };

    const invalidData = [
      { id: 'uuid-1' }, // Missing name and age
      { id: 'uuid-2', name: 'Bob' }, // Missing age
    ] as TestDataWithRequired[];

    render(
      <DataTable<TestDataWithRequired, any>
        columns={columns}
        data={invalidData}
      />,
    );

    // Should render without crashing
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('handles extremely long text content', () => {
    const longTextData = [
      {
        id: 'uuid-1',
        name: 'A'.repeat(1000), // Very long name
        age: 25,
      },
    ];

    render(
      <DataTable
        {...defaultProps}
        data={longTextData}
      />,
    );

    // Should render without breaking layout
    const cell = screen.getByText('A'.repeat(1000));

    expect(cell).toBeInTheDocument();
    expect(cell.closest('td')).toHaveClass('p-4');
  });

  it('handles special characters in data', () => {
    const specialCharsData = [
      {
        id: 'uuid-1',
        name: '!@#$%^&*()',
        age: 25,
      },
      {
        id: 'uuid-2',
        name: '< > & " \'',
        age: 30,
      },
    ];

    render(
      <DataTable
        {...defaultProps}
        data={specialCharsData}
      />,
    );

    // Should render special characters correctly
    expect(screen.getByText('!@#$%^&*()')).toBeInTheDocument();
    expect(screen.getByText('< > & " \'')).toBeInTheDocument();
  });
});
