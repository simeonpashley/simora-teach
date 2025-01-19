import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';

import { columns, testData } from './__tests__/test-utils';
import { DataTableBody } from './DataTableBody';

function TestBody({ data = testData, noResults = 'No results found.' }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <DataTableBody
        table={table}
        columns={columns.length}
        noResults={noResults}
      />
    </table>
  );
}

describe('DataTableBody', () => {
  it('renders data rows', () => {
    render(<TestBody />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('shows no results message when data is empty', () => {
    const noResults = 'Custom no results message';
    render(<TestBody data={[]} noResults={noResults} />);

    expect(screen.getByText(noResults)).toBeInTheDocument();
  });
});
