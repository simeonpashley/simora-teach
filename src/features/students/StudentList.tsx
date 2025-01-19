'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';

import type { Student } from '@/api/students';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useStudents } from '@/contexts/useStudents';

import { useStudentColumns } from './StudentListColumns';

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
  const [searchTerm, setSearchTerm] = useState(filters.search ?? '');

  const debouncedSetFilters = useCallback((value: string) => {
    setFilters({ ...filters, search: value });
  }, [filters, setFilters]);

  useEffect(() => {
    const handler = setTimeout(() => {
      debouncedSetFilters(searchTerm);
    }, 300); // Adjust the delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debouncedSetFilters]);
  const columns = useStudentColumns(students, selectedIds, toggleSelection, toggleAllSelection);

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
          onChange={e => setSearchTerm(e.target.value)} // Update local state
          className="max-w-sm"
        />
        <Select
          value={filters.status || 'all'}
          onValueChange={value => setFilters({ ...filters, status: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('all_statuses')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{t('all_statuses')}</SelectItem>
              <SelectItem value="active">{t('status_active')}</SelectItem>
              <SelectItem value="inactive">{t('status_inactive')}</SelectItem>
              <SelectItem value="pending">{t('status_pending')}</SelectItem>
            </SelectGroup>
          </SelectContent>
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
                onPageChange: pageIndex => setPagination({ page: pageIndex }),
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
