import type { StudentFilters } from '@/dao/StudentDAO';
import type { studentOverviewSchema } from '@/models/Schema';

import { BaseApiClient } from './base';
import type { PaginationParams } from './types';

export type Student = typeof studentOverviewSchema.$inferSelect;

export type StudentSortParams = {
  sortBy: keyof Student;
  sortOrder: 'asc' | 'desc';
};

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

  async get(id: number) {
    return await this.request<Student>(`/${id}`);
  }

  async create(student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) {
    return await this.request<Student>('', {
      method: 'POST',
      body: student,
    });
  }

  async update(id: number, student: Partial<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await this.request<Student>(`/${id}`, {
      method: 'PATCH',
      body: student,
    });
  }

  async delete(id: number) {
    await this.request(`/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteMany(ids: number[]) {
    await this.request('', {
      method: 'DELETE',
      body: { ids },
    });
  }
}

export const studentsApi = new StudentsApi();
