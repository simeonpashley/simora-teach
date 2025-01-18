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

  async getStudentById(id: number) {
    const student = await studentDAO.findById(id);
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  }

  async deleteStudents(ids: number[]) {
    await studentDAO.deleteMany(ids);
  }
}

export const studentService = new StudentService();
