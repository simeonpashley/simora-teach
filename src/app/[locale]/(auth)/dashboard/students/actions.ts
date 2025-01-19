'use server';

import type { Student, StudentFilters, StudentSortParams } from '@/app-api-clients/students';
import type { PaginationParams } from '@/app-api-clients/types';
import { studentService } from '@/services/StudentService';

export type GetStudentsResponse = {
  data: Student[];
  totalPages: number;
  totalItems: number;
};

export async function getStudents(
  filters?: StudentFilters,
  pagination?: PaginationParams,
  sort?: StudentSortParams,
): Promise<GetStudentsResponse> {
  try {
    const result = await studentService.getStudents(filters, pagination, sort);
    return {
      data: result.data,
      totalPages: result.pagination?.totalPages ?? 1,
      totalItems: result.pagination?.total ?? result.data.length,
    };
  } catch (error) {
    console.error('Failed to fetch students:', error);
    throw error;
  }
}

export async function deleteStudents(studentIds: string[]) {
  try {
    await studentService.deleteStudents(studentIds);
  } catch (error) {
    console.error('Failed to delete students:', error);
    throw error;
  }
}
