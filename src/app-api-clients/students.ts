import type { Student as daoStudent, StudentFilters as daoStudentFilters } from '@/dao/StudentDAO';

import { BaseApiClient } from './base';
import type { PaginationParams } from './types';

export type Student = daoStudent;
export type StudentFilters = daoStudentFilters;
export type StudentStatus = daoStudent['status'];
export type StudentSortParams = {
  sortBy: keyof Student;
  sortOrder: 'asc' | 'desc';
};

/**
 * StudentsApi class
 * @description API client for students
 */
export class StudentsApi extends BaseApiClient {
  constructor() {
    super('/api/students');
  }

  async list(
    filters?: StudentFilters,
    pagination?: PaginationParams,
    sort?: StudentSortParams,
  ) {
    try {
      return await this.request<Student[]>('', {
        params: {
          ...filters,
          ...pagination,
          ...sort,
        },
      });
    } catch (error) {
      console.error('Failed to fetch students:', {
        filters,
        pagination,
        sort,
        error,
      });
      throw error;
    }
  }

  async get(id: string) {
    return await this.request<Student>(`/${id}`);
  }

  async create(student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) {
    return await this.request<Student>('', {
      method: 'POST',
      body: student,
    });
  }

  async update(id: string, student: Partial<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await this.request<Student>(`/${id}`, {
      method: 'PATCH',
      body: student,
    });
  }

  async delete(id: string) {
    await this.request(`/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteMany(ids: string[]) {
    await this.request('', {
      method: 'DELETE',
      body: { ids },
    });
  }
}

export const studentsApi = new StudentsApi();
