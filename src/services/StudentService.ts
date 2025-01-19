import type { PaginationParams, SortParams, StudentFilters } from '@/dao/StudentDAO';
import { studentDAO } from '@/dao/StudentDAO';

export class StudentService {
  async getStudents(
    filters?: StudentFilters,
    pagination?: PaginationParams,
    sort?: SortParams,
  ) {
    return studentDAO.findAll(filters, pagination, sort);
  }

  async getStudentById(id: string) {
    const student = await studentDAO.findById(id);
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  }

  async deleteStudents(ids: string[]) {
    await studentDAO.deleteMany(ids);
  }
}

export const studentService = new StudentService();
