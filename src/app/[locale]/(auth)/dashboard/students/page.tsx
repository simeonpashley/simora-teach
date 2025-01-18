import { getTranslations } from 'next-intl/server';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { StudentList } from '@/features/students/StudentList';

import { getStudents } from './actions';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Students',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function StudentsPage() {
  const t = await getTranslations('Students');
  const { data: students } = await getStudents();

  return (
    <>
      <TitleBar
        title={t('title')}
        description={t('description')}
      />

      <div className="rounded-md border bg-card p-6">
        <StudentList students={students} />
      </div>
    </>
  );
}
