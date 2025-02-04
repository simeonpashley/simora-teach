'use client';

import type {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import {
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Table } from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { DataTableBody } from './DataTableBody';
import { DataTableFooter } from './DataTableFooter';
import { DataTableHeader } from './DataTableHeader';

type DataTableProps<TData extends { id: string }, TValue> = {
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
    selectedRows: Set<string>;
    onSelectedRowsChange: (selectedRows: Set<string>) => void;
  };
  selectionActions?: Array<{
    label: string;
    onClick: (selectedIds: string[]) => void;
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

export function DataTable<TData extends { id: string }, TValue>({
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
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
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
          if (pagination?.onPageSet) {
            pagination.onPageSet(0);
          }
        }
      }
    },
    onColumnFiltersChange: (updatedFilters) => {
      if (filtering?.onColumnFiltersChange) {
        filtering.onColumnFiltersChange(updatedFilters);
        if (pagination?.onPageSet) {
          pagination.onPageSet(0);
        }
      }
    },
    enableRowSelection: !!selection,
    getRowId: row => String((row as { id: string }).id),
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
                .map(([id]) => id)),
            );
          } else {
            selection.onSelectedRowsChange(
              new Set(Object.entries(updatedSelection)
                .filter(([, selected]) => selected)
                .map(([id]) => id)),
            );
          }
        }
      : undefined,
  });

  const { rows } = table.getRowModel();
  const pageIndex = (pagination?.pageIndex ?? 1);
  const pageSize = pagination?.pageSize ?? 10;
  const from = (pageIndex - 1) * pageSize + 1;
  const to = Math.min(
    (pageIndex - 1) * pageSize + pageSize,
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
          <DataTableHeader
            table={table}
            selection={selection}
            sorting={sorting}
            filtering={filtering}
          />
          <DataTableBody
            table={table}
            selection={selection}
            noResults={noResults}
            columns={columns.length}
          />
        </Table>
      </div>

      {pagination && rows.length > 0 && (
        <DataTableFooter
          pagination={pagination}
          rowCount={rows.length}
        />
      )}
    </div>
  );
}
