import type { Table } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

import {
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';

type DataTableBodyProps<TData> = {
  table: Table<TData>;
  selection?: {
    selectedRows: Set<number>;
    onSelectedRowsChange: (selectedRows: Set<number>) => void;
  };
  noResults?: string;
  columns: number;
};

export function DataTableBody<TData>({
  table,
  selection,
  noResults = 'No results found.',
  columns,
}: DataTableBodyProps<TData>) {
  const { rows } = table.getRowModel();

  if (rows.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={columns + (selection ? 1 : 0)}
            className="h-24 text-center"
          >
            {noResults}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {rows.map(row => (
        <TableRow key={row.id}>
          {selection && (
            <TableCell className="w-[40px] px-2">
              <input
                type="checkbox"
                data-row-id={String((row.original as { id: number }).id)}
                checked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
                className="size-4 rounded border-gray-300"
              />
            </TableCell>
          )}
          {row.getVisibleCells().map(cell => (
            <TableCell key={cell.id}>
              {flexRender(
                cell.column.columnDef.cell,
                cell.getContext(),
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
