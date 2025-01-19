import type { StudentFilters, StudentOverview } from '@/dao/StudentDAO';

import { BaseApiClient } from './base';
import type { PaginationParams } from './types';

export type StudentSortParams = {
  sortBy: keyof StudentOverview;
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
      return await this.request<StudentOverview[]>('', {
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
    return await this.request<StudentOverview>(`/${id}`);
  }

  async create(student: Omit<StudentOverview, 'id' | 'createdAt' | 'updatedAt'>) {
    return await this.request<StudentOverview>('', {
      method: 'POST',
      body: student,
    });
  }

  async update(id: number, student: Partial<Omit<StudentOverview, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await this.request<StudentOverview>(`/${id}`, {
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
