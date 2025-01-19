import type {
  ColumnFiltersState,
  OnChangeFn,
  Table,
} from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

import {
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { TableFilter } from '../table-filter';

type DataTableHeaderProps<TData> = {
  table: Table<TData>;
  selection?: {
    selectedRows: Set<string>;
    onSelectedRowsChange: (selectedRows: Set<string>) => void;
  };
  sorting?: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSort: (field: string) => void;
  };
  filtering?: {
    columnFilters: ColumnFiltersState;
    onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  };
};

export function DataTableHeader<TData>({
  table,
  selection,
  sorting,
  filtering,
}: DataTableHeaderProps<TData>) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map(headerGroup => (
        <TableRow key={headerGroup.id}>
          {selection && (
            <TableHead key={`${headerGroup.id}-selection`} className="w-[40px] px-2">
              <input
                type="checkbox"
                aria-label="Select all"
                checked={table.getIsAllRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
                className="size-4 rounded border-gray-300"
              />
            </TableHead>
          )}
          {headerGroup.headers.map((header) => {
            const canSort = sorting && header.column.getCanSort();
            const sortDirection = header.column.getIsSorted();

            return (
              <TableHead
                key={header.id}
                className={cn(
                  canSort && 'cursor-pointer select-none',
                  header.column.getCanSort() && 'cursor-pointer select-none',
                )}
                onClick={() => {
                  if (!canSort) {
                    return;
                  }
                  const id = header.column.id;
                  sorting.onSort(id);
                }}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {canSort && (
                      <span className="text-xs">
                        {sortDirection === 'asc' ? '↑' : sortDirection === 'desc' ? '↓' : ''}
                      </span>
                    )}
                  </div>
                  {header.column.getCanFilter() && filtering && (
                    <button
                      type="button"
                      onClick={e => e.stopPropagation()}
                      onKeyDown={e => e.stopPropagation()}
                      className="flex w-full"
                    >
                      <TableFilter column={header.column} />
                    </button>
                  )}
                </div>
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
