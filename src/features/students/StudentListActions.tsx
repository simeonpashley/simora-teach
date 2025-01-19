'use client';

import { useTranslations } from 'next-intl';

import { ActionIcon } from '@/components/ui/ActionIcon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import type { Student } from './StudentListColumns';

type StudentActionsProps = {
  selectedStudents: Student[];
  onDeleteStudents?: (studentIds: string[]) => Promise<void>;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  locale: string;
};

export function StudentActions({
  selectedStudents,
  onDeleteStudents,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  locale,
}: StudentActionsProps) {
  const t = useTranslations('StudentList');
  const selectedStudentIds = selectedStudents.map(student => student.id);

  const handleDelete = async () => {
    if (onDeleteStudents) {
      await onDeleteStudents(selectedStudentIds);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleExport = () => {
    // Convert selected rows to CSV format
    const headers = ['ID', 'First Name', 'Last Name', 'Date of Birth', 'Enrollment Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...selectedStudents.map(row => [
        row.id,
        row.firstName,
        row.lastName,
        row.dateOfBirth ? new Date(row.dateOfBirth).toLocaleDateString(locale) : '',
        row.enrollmentDate ? new Date(row.enrollmentDate).toLocaleDateString(locale) : '',
        row.status || '',
      ].join(',')),
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `students_export_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="border-b border-border/40 bg-background/95 p-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {t('selected_items', { count: selectedStudents.length })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-red-600 hover:text-red-700"
            >
              <ActionIcon type="delete" className="mr-2 size-4" />
              {t('delete_selected')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <ActionIcon type="export" className="mr-2 size-4" />
              {t('export_selected')}
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete_confirmation_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('delete_confirmation_description', {
                count: selectedStudentIds.length,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {t('confirm_delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
