'use client';

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues as getFacetedMinMaxValuesFromTable,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { PaginationButtons } from './PaginationButtons';
import { TableFilter } from './table-filter';

type DataTableProps<TData extends { id: number }, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  pagination?: {
    totalRows: number;
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    totalItems?: number;
    onPageSet: (pageIndex: number) => void;
    onPageSizeChange: (pageSize: number) => void;
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
  selection?: {
    selectedRows: Set<number>;
    onSelectedRowsChange: (selectedRows: Set<number>) => void;
  };
  selectionActions?: Array<{
    label: string;
    onClick: (selectedIds: number[]) => void;
  }>;
  noResults?: string;
  className?: string;
};

// Utility function to convert sorting state
const convertSortingState = (sorting?: DataTableProps<any, any>['sorting']): SortingState => {
  if (!sorting) {
    return [];
  }
  return [{
    id: sorting.sortBy,
    desc: sorting.sortOrder === 'desc',
  }];
};

// Utility function to convert pagination state
const convertPaginationState = (pagination?: DataTableProps<any, any>['pagination']): PaginationState => {
  return {
    pageIndex: pagination?.pageIndex ?? 0,
    pageSize: pagination?.pageSize ?? 10,
  };
};

export function DataTable<TData extends { id: number }, TValue>({
  data,
  columns,
  pagination,
  sorting,
  filtering,
  selection,
  selectionActions,
  noResults = 'No results found.',
  className,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValuesFromTable(),
    manualPagination: true,
    pageCount: pagination?.pageCount ?? -1,
    state: {
      pagination: convertPaginationState(pagination),
      sorting: convertSortingState(sorting),
      columnFilters: filtering?.columnFilters ?? [],
      rowSelection: selection
        ? Object.fromEntries(
            Array.from(selection.selectedRows).map(id => [String(id), true]),
          )
        : {},
    },
    manualSorting: true,
    enableSorting: true,
    enableMultiSort: false,
    onSortingChange: (updatedSorting) => {
      if (sorting && Array.isArray(updatedSorting) && updatedSorting.length > 0) {
        const [sort] = updatedSorting;
        if (sort?.id) {
          sorting.onSort(sort.id);
        }
      }
    },
    onColumnFiltersChange: filtering?.onColumnFiltersChange,
    enableRowSelection: !!selection,
    getRowId: row => String((row as { id: number }).id),
    onRowSelectionChange: selection
      ? (updatedSelection) => {
          if (typeof updatedSelection === 'function') {
            const currentSelection = Object.fromEntries(
              Array.from(selection.selectedRows).map(id => [String(id), true]),
            );
            const newSelection = updatedSelection(currentSelection);
            selection.onSelectedRowsChange(
              new Set(Object.entries(newSelection)
                .filter(([, selected]) => selected)
                .map(([id]) => Number(id))),
            );
          } else {
            selection.onSelectedRowsChange(
              new Set(Object.entries(updatedSelection)
                .filter(([, selected]) => selected)
                .map(([id]) => Number(id))),
            );
          }
        }
      : undefined,
  });

  const { rows } = table.getRowModel();
  const from = (pagination?.pageIndex ?? 0) * (pagination?.pageSize ?? 10) + 1;
  const to = Math.min(
    (pagination?.pageIndex ?? 0) * (pagination?.pageSize ?? 10) + (pagination?.pageSize ?? 10),
    pagination?.totalRows ?? 1,
  );
  const total = pagination?.totalRows ?? 1;

  return (
    <div className={cn('space-y-4', className)}>
      {selection && selectionActions && selection.selectedRows.size > 0 && (
        <div
          data-testid="selection-actions"
          className="flex items-center justify-between rounded-md border bg-muted px-4 py-2"
        >
          <span className="text-sm text-muted-foreground">
            {selection.selectedRows.size}
            {' '}
            {selection.selectedRows.size === 1 ? 'row' : 'rows'}
            {' '}
            selected
          </span>
          <div className="flex items-center gap-2">
            {selectionActions.map(action => (
              <button
                key={action.label}
                type="button"
                onClick={() => action.onClick(Array.from(selection.selectedRows))}
                className="rounded px-2 py-1 text-sm font-medium hover:bg-muted-foreground/10"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-md border">
        {pagination && (
          <div className="px-4 py-2 text-sm text-muted-foreground">
            {`Showing ${from} - ${to} of ${total} items`}
          </div>
        )}
        <Table>
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
          <TableBody>
            {rows.length === 0
              ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + (selection ? 1 : 0)}
                      className="h-24 text-center"
                    >
                      {noResults}
                    </TableCell>
                  </TableRow>
                )
              : (
                  rows.map(row => (
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
                  ))
                )}
          </TableBody>
        </Table>
      </div>

      {pagination && rows.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select
              data-testid="rows-per-page-select"
              value={String(pagination.pageSize)}
              onValueChange={value => pagination.onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 50].map(size => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <PaginationButtons
            pageIndex={pagination.pageIndex}
            pageCount={pagination.pageCount}
            onPageSet={pagination.onPageSet}
          />
        </div>
      )}
    </div>
  );
}
