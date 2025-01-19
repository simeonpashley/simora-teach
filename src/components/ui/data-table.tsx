'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
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
};

const PaginationButton = ({
  onClick,
  disabled,
  testId,
  children,
}: { onClick: () => void; disabled: boolean; testId: string; children: React.ReactNode }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
    >
      {children}
    </Button>
  );
};

export function DataTable<TData, TValue>({
  data,
  columns,
  pagination,
  sorting,
  noResults = 'No results found.',
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination?.pageCount ?? -1,
  });

  const index = pagination?.pageIndex ?? 0;
  const pageSize = pagination?.pageSize ?? 10;
  const totalRows = pagination?.totalRows ?? 1;
  const rows = table.getRowModel().rows;
  const from = index * pageSize + 1;
  const to = Math.min(index * pageSize + pageSize, totalRows);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <h3>
          {`Showing ${from} - ${to} of ${totalRows} students`}
        </h3>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const column = header.column.columnDef as ColumnDef<TData, TValue> & {
                    accessorKey?: string;
                  };
                  const canSort = sorting && column.accessorKey;
                  return (
                    <TableHead
                      key={header.id}
                      className={canSort ? 'cursor-pointer select-none' : ''}
                      onClick={() => {
                        if (canSort) {
                          sorting.onSort(column.accessorKey as string);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {canSort
                        && column.accessorKey === sorting.sortBy && (
                          <span className="text-xs">
                            {sorting.sortOrder === 'asc' ? '↑' : '↓'}
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
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
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

          <div data-testid="pagination-buttons" className="flex items-center gap-2">
            <PaginationButton
              onClick={() => pagination.onPageSet(0)}
              disabled={pagination.pageIndex === 0}
              testId="first-page"
            >
              {'<<'}
            </PaginationButton>
            <PaginationButton
              onClick={() => pagination.onPageSet(pagination.pageIndex - 1)}
              disabled={pagination.pageIndex === 0}
              testId="previous-page"
            >
              {'<'}
            </PaginationButton>
            <span className="text-sm">
              Page
              {' '}
              {pagination.pageIndex}
              {' '}
              of
              {' '}
              {pagination.pageCount}
            </span>
            <PaginationButton
              onClick={() => pagination.onPageSet(pagination.pageIndex + 1)}
              disabled={pagination.pageIndex === pagination.pageCount}
              testId="next-page"
            >
              {'>'}
            </PaginationButton>
            <PaginationButton
              onClick={() => pagination.onPageSet(pagination.pageCount)}
              disabled={pagination.pageIndex === pagination.pageCount}
              testId="last-page"
            >
              {'>>'}
            </PaginationButton>
          </div>
        </div>
      )}
    </div>
  );
}
