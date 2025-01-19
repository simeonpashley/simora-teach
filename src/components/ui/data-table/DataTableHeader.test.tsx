import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';

import { DataTableHeader } from './DataTableHeader';

const testData = [
  { id: 1, name: 'John', age: 25 },
  { id: 2, name: 'Jane', age: 30 },
];

const columnHelper = createColumnHelper<typeof testData[0]>();
const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    cell: info => info.getValue(),
  }),
];

function TestHeader() {
  const table = useReactTable({
    data: testData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <DataTableHeader table={table} />
    </table>
  );
}

describe('DataTableHeader', () => {
  it('renders column headers', () => {
    render(<TestHeader />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });
});
