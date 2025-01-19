'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
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

type DataTableProps<TData, TValue> = {
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

export function DataTable<TData, TValue>({
  data,
  columns,
  pagination,
  sorting,
  noResults = 'No results found.',
  className,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination?.pageCount ?? -1,
    state: {
      pagination: convertPaginationState(pagination),
      sorting: convertSortingState(sorting),
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
                {headerGroup.headers.map((header) => {
                  const canSort = sorting && header.column.getCanSort();
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        canSort && 'cursor-pointer select-none',
                        header.column.getCanSort() && 'cursor-pointer select-none',
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {canSort && (
                          <span className="text-xs">
                            {{
                              asc: '↑',
                              desc: '↓',
                            }[header.column.getIsSorted() as string] ?? null}
                          </span>
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
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {noResults}
                    </TableCell>
                  </TableRow>
                )
              : (
                  rows.map(row => (
                    <TableRow key={row.id}>
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
