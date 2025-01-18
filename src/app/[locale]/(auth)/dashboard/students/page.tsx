import { getTranslations } from 'next-intl/server';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { StudentList } from '@/features/students/StudentList';
import { studentService } from '@/services/StudentService';

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

async function getStudents() {
  try {
    const result = await studentService.getStudents();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch students:', error);
    throw error;
  }
}

export default async function StudentsPage() {
  const t = await getTranslations('Students');
  const students = await getStudents();

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
