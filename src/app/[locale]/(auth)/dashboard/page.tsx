import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';

export default async function DashboardIndexPage() {
  const t = await getTranslations('DashboardIndex');

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      <div className="mt-7">
        <Link href="/dashboard/students">
          <Button>{t('view_students')}</Button>
        </Link>
      </div>
    </>
  );
}
