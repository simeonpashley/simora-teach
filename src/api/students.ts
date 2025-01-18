import type { studentOverviewSchema } from '@/models/Schema';

import { BaseApiClient } from './base';
import type { PaginationParams } from './types';

export type Student = typeof studentOverviewSchema.$inferSelect;

export type StudentFilters = {
  search?: string;
  status?: string;
};

export type StudentSortParams = {
  sortBy: keyof Student;
  sortOrder: 'asc' | 'desc';
};

export class StudentsApi extends BaseApiClient {
  constructor() {
    super('/api/students');
  }

  async getStudents(
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

  async deleteStudents(ids: number[]) {
    await this.request('', {
      method: 'DELETE',
      body: { ids },
    });
  }
}

export const studentsApi = new StudentsApi();
