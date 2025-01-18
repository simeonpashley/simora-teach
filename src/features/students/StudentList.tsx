'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import type { Student } from '@/api/students';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useStudents } from '@/contexts/StudentsContext';

export function StudentList() {
  const t = useTranslations('Students');
  const {
    students,
    isLoading,
    error,
    selectedIds,
    filters,
    pagination,
    sort,
    setFilters,
    setPagination,
    setSort,
    toggleSelection,
    toggleAllSelection,
    deleteSelected,
  } = useStudents();

  const columns: ColumnDef<Student, unknown>[] = [
    {
      id: 'select',
      header: () => (
        <input
          type="checkbox"
          checked={students?.length > 0 && selectedIds.length === students.length}
          onChange={toggleAllSelection}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.original.id)}
          onChange={() => toggleSelection(row.original.id)}
        />
      ),
    },
    {
      accessorKey: 'firstName',
      header: t('first_name'),
    },
    {
      accessorKey: 'lastName',
      header: t('last_name'),
    },
    {
      accessorKey: 'status',
      header: t('status'),
    },
  ];

  if (error) {
    return (
      <Alert variant="destructive">
        {t('error_loading_students')}
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder={t('search_placeholder')}
          value={filters.search ?? ''}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
          className="max-w-sm"
        />
        <Select
          value={filters.status ?? ''}
          onValueChange={value => setFilters({ ...filters, status: value })}
        >
          <option value="">{t('all_statuses')}</option>
          <option value="active">{t('status_active')}</option>
          <option value="inactive">{t('status_inactive')}</option>
        </Select>
      </div>

      {/* Selected Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 rounded bg-muted/50 p-2">
          <span>{t('selected_count', { count: selectedIds.length })}</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={deleteSelected}
            disabled={isLoading}
          >
            {t('delete_selected')}
          </Button>
        </div>
      )}

      {/* Table */}
      {isLoading
        ? (
            <div className="flex justify-center p-4">
              <Spinner />
            </div>
          )
        : (
            <DataTable<Student, unknown>
              data={students ?? []}
              columns={columns}
              pagination={{
                pageIndex: pagination.page - 1,
                pageSize: pagination.pageSize,
                pageCount: pagination.totalPages ?? -1,
                onPageChange: pageIndex => setPagination({ page: pageIndex + 1 }),
                onPageSizeChange: pageSize => setPagination({ pageSize }),
              }}
              sorting={{
                sortBy: sort.sortBy,
                sortOrder: sort.sortOrder,
                onSort: (field) => {
                  setSort({
                    sortBy: field as keyof Student,
                    sortOrder: field === sort.sortBy && sort.sortOrder === 'asc'
                      ? 'desc'
                      : 'asc',
                  });
                },
              }}
            />
          )}
    </div>
  );
}
