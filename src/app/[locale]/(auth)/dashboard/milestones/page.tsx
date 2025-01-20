'use client';

import { useTranslations } from 'next-intl';

import { MilestoneList } from '@/features/milestones/MilestoneList';

export default function MilestonesPage() {
  const t = useTranslations('Milestones');

  return (
    <div className="container space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
      </div>
      <MilestoneList />
    </div>
  );
}
