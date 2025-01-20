'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import type { Milestone } from '@/app-api-clients/milestones';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Markdown } from '@/components/ui/markdown';

export function useMilestoneColumns(): ColumnDef<Milestone, unknown>[] {
  const t = useTranslations('Milestones');
  const locale = useLocale();
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);

  const SortableHeader = ({ column, children }: { column: any; children: React.ReactNode }) => (
    <div
      role="button"
      tabIndex={0}
      onClick={() => column.toggleSorting()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          column.toggleSorting();
        }
      }}
      className="flex cursor-pointer items-center hover:text-accent-foreground"
    >
      {children}
    </div>
  );

  return [
    {
      accessorKey: 'studentName',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('student_name')}
        </SortableHeader>
      ),
      meta: {
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'milestoneName',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('milestone_name')}
        </SortableHeader>
      ),
      meta: {
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'milestoneCategory',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('category')}
        </SortableHeader>
      ),
      meta: {
        filterVariant: 'select',
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('status')}
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              status === 'Emerging'
                ? 'bg-yellow-100 text-yellow-800'
                : status === 'Developing'
                  ? 'bg-blue-100 text-blue-800'
                  : status === 'Secure'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
            }`}
          >
            {t(`status_${status.toLowerCase()}`)}
          </span>
        );
      },
      meta: {
        filterVariant: 'select',
      },
    },
    {
      accessorKey: 'evidence',
      header: t('evidence'),
      cell: ({ row }) => {
        const evidence = row.getValue('evidence') as string;
        if (!evidence) {
          return '-';
        }

        const excerpt = evidence.length > 50 ? `${evidence.slice(0, 50)}...` : evidence;

        return (
          <>
            <Button
              variant="link"
              onClick={() => setSelectedEvidence(evidence)}
              className="h-auto p-0 text-left"
            >
              {excerpt}
            </Button>
            <Dialog open={selectedEvidence === evidence} onOpenChange={() => setSelectedEvidence(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('evidence_for', { milestone: row.getValue('milestoneName') })}</DialogTitle>
                  <DialogDescription asChild>
                    <div className="mt-4">
                      <Markdown>{evidence}</Markdown>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </>
        );
      },
      enableSorting: false,
      meta: {
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'recordedAt',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('recorded_at')}
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const date = row.getValue('recordedAt') as Date;
        return date
          ? new Date(date).toLocaleDateString(locale, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
          : '-';
      },
      enableColumnFilter: false,
    },
  ];
}
