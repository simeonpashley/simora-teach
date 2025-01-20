'use client';

import type { ColumnFiltersState } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';

import type { Milestone } from '@/app-api-clients/milestones';
import { milestonesApi } from '@/app-api-clients/milestones';
import { Alert } from '@/components/ui/alert';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

import { useMilestoneColumns } from './MilestoneListColumns';

// Default values
const DEFAULT_PAGE_SIZE = 10;

export function MilestoneList() {
  const t = useTranslations('Milestones');

  // State
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(1);
  const [sortBy, setSortBy] = useState<keyof Milestone>('milestoneName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Fetch data
  const fetchMilestones = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await milestonesApi.list(
        { search: searchTerm || undefined, category, status },
        { page, pageSize },
        { sortBy: sortBy as keyof Milestone, sortOrder },
      );

      if (response.data) {
        setMilestones(response.data);
      }

      if (response.pagination) {
        setTotal(response.pagination.total);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to load milestones'));
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, category, status, page, pageSize, sortBy, sortOrder]);

  // Initial load and data refresh
  useEffect(() => {
    const timeoutId = setTimeout(fetchMilestones, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchMilestones]);

  // Sort handler
  const handleSort = useCallback((field: string) => {
    setSortBy(field as keyof Milestone);
    setSortOrder(prev => field === sortBy && prev === 'asc' ? 'desc' : 'asc');
  }, [sortBy]);

  // Get columns configuration
  const columns = useMilestoneColumns();

  if (error) {
    return (
      <Alert variant="destructive">
        {t('error_loading_milestones')}
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
          value={category || 'all'}
          onValueChange={value => setCategory(value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('all_categories')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{t('all_categories')}</SelectItem>
              <SelectItem value="communication">{t('category_communication')}</SelectItem>
              <SelectItem value="physical">{t('category_physical')}</SelectItem>
              <SelectItem value="social">{t('category_social')}</SelectItem>
              <SelectItem value="cognitive">{t('category_cognitive')}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
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
              <SelectItem value="Emerging">{t('status_emerging')}</SelectItem>
              <SelectItem value="Developing">{t('status_developing')}</SelectItem>
              <SelectItem value="Secure">{t('status_secure')}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading
        ? (
            <div className="flex justify-center p-4">
              <Spinner />
            </div>
          )
        : (
            <DataTable<Milestone, unknown>
              data={milestones}
              columns={columns}
              pagination={{
                totalRows: total,
                pageIndex: page,
                pageSize,
                pageCount: totalPages,
                onPageSet: (index) => {
                  setPage(index);
                },
                onPageSizeChange: (size) => {
                  setPageSize(size);
                  setPage(1);
                },
              }}
              sorting={{
                sortBy,
                sortOrder,
                onSort: handleSort,
              }}
              filtering={{
                columnFilters,
                onColumnFiltersChange: setColumnFilters,
              }}
            />
          )}
    </div>
  );
}
