'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';

import type { Student } from '@/api/students';
import { studentsApi } from '@/api/students';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

import { useStudentColumns } from './StudentListColumns';

// Default values
const DEFAULT_PAGE_SIZE = 10;

export function StudentList() {
  const t = useTranslations('Students');

  // State
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(1);
  const [sortBy, setSortBy] = useState<keyof Student>('lastName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Fetch data
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await studentsApi.list(
        { search: searchTerm || undefined, status },
        { page, pageSize },
        { sortBy, sortOrder },
      );

      setStudents(response.data);
      if (response.pagination) {
        setTotal(response.pagination.total);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to load students'));
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, status, page, pageSize, sortBy, sortOrder]);

  // Initial load and data refresh
  useEffect(() => {
    const timeoutId = setTimeout(fetchStudents, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchStudents]);

  // Selection handlers
  const toggleSelection = useCallback((id: number) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id],
    );
  }, []);

  const toggleAllSelection = useCallback(() => {
    setSelectedIds(prev =>
      prev.length === students.length
        ? []
        : students.map(student => student.id),
    );
  }, [students]);

  // Delete handler
  const handleDelete = useCallback(async () => {
    if (selectedIds.length === 0 || isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      await studentsApi.deleteMany(selectedIds);
      setSelectedIds([]);
      await fetchStudents();
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to delete students'));
    }
  }, [selectedIds, isLoading, fetchStudents]);

  // Sort handler
  const handleSort = useCallback((field: string) => {
    setSortBy(field as keyof Student);
    setSortOrder(prev => field === sortBy && prev === 'asc' ? 'desc' : 'asc');
  }, [sortBy]);

  // Get columns configuration
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
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={status || 'all'}
          onValueChange={value => setStatus(value === 'all' ? undefined : value)}
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
            onClick={handleDelete}
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
              data={students}
              columns={columns}
              pagination={{ totalRows: total, pageIndex: page, pageSize, pageCount: totalPages, onPageSet: (index) => {
                setPage(index);
              }, onPageSizeChange: (size) => {
                setPageSize(size);
                setPage(1);
              } }}
              sorting={{
                sortBy,
                sortOrder,
                onSort: handleSort,
              }}
            />
          )}
    </div>
  );
}
