import { getTranslations } from 'next-intl/server';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { StudentList } from '@/features/students/StudentList';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;

  const {
    locale,
  } = params;

  const t = await getTranslations({ locale, namespace: 'Students' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function StudentsPage() {
  const t = await getTranslations('Students');

  return (
    <div className="space-y-6">
      <TitleBar
        title={t('title')}
        description={t('description')}
      />

      <div className="rounded-md border bg-card p-6">
        <StudentList />
      </div>
    </div>
  );
}
