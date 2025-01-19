'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useLocale, useTranslations } from 'next-intl';

import { ActionIcon } from '@/components/ui/ActionIcon';
import { Button } from '@/components/ui/button';
import { SortButton } from '@/components/ui/SortButton';

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  enrollmentDate: Date | null;
  status: string | null;
};

export function useStudentColumns(students: Student[], selectedIds: number[], toggleSelection: (id: number) => void, toggleAllSelection: () => void): ColumnDef<Student>[] {
  const t = useTranslations('Students');
  const locale = useLocale();

  return [
    {
      id: 'select',
      header: () => (
        <div className="px-1">
          <input
            type="checkbox"
            checked={students?.length > 0 && selectedIds.length === students.length}
            onChange={toggleAllSelection}
            className="size-4 rounded border-gray-300"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <input
            type="checkbox"
            checked={selectedIds.includes(row.original.id)}
            onChange={() => toggleSelection(row.original.id)}
            className="size-4 rounded border-gray-300"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <SortButton onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          ID
        </SortButton>
      ),
    },
    {
      accessorKey: 'firstName',
      header: ({ column }) => (
        <SortButton onClick={() => column.toggleSorting()}>
          {t('first_name')}
        </SortButton>
      ),
    },
    {
      accessorKey: 'lastName',
      header: ({ column }) => (
        <SortButton onClick={() => column.toggleSorting()}>
          {t('last_name')}
        </SortButton>
      ),
    },
    {
      accessorKey: 'dateOfBirth',
      header: ({ column }) => (
        <SortButton onClick={() => column.toggleSorting()}>
          {t('date_of_birth')}
        </SortButton>
      ),
      cell: ({ row }) => {
        const date = row.getValue('dateOfBirth') as Date;
        return date
          ? new Date(date).toLocaleDateString(locale, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
          : '-';
      },
    },
    {
      accessorKey: 'enrollmentDate',
      header: ({ column }) => (
        <SortButton onClick={() => column.toggleSorting()}>
          {t('enrollment_date')}
        </SortButton>
      ),
      cell: ({ row }) => {
        const date = row.getValue('enrollmentDate') as Date;
        return date
          ? new Date(date).toLocaleDateString(locale, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
          : '-';
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <SortButton onClick={() => column.toggleSorting()}>
          {t('status')}
        </SortButton>
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              status === 'active'
                ? 'bg-green-100 text-green-800'
                : status === 'inactive'
                  ? 'bg-red-100 text-red-800'
                  : status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
            }`}
          >

            <>{t(`status_${status?.toLowerCase() || 'unknown'}`)}</>
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: t('actions'),
      cell: ({ row }) => (
        <Button
          variant="ghost"
          onClick={() => console.warn('Edit student:', row.original.id)}
          className="size-8 p-0"
        >
          <ActionIcon type="edit" />
          <span className="sr-only">{t('edit')}</span>
        </Button>
      ),
    },
  ];
}

export type { Student };
