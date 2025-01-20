import { BaseApiClient } from './base';
import type { PaginationParams } from './types';

export type Milestone = {
  id: string;
  studentId: string;
  studentName: string;
  milestoneName: string;
  milestoneCategory: string;
  status: 'Emerging' | 'Developing' | 'Secure';
  evidence?: string;
  recordedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type MilestoneFilters = {
  search?: string;
  category?: string;
  status?: string;
};

export type MilestoneSortParams = {
  sortBy: keyof Milestone;
  sortOrder: 'asc' | 'desc';
};

export class MilestonesApi extends BaseApiClient {
  constructor() {
    super('/api/milestones');
  }

  async list(
    filters?: MilestoneFilters,
    pagination?: PaginationParams,
    sort?: MilestoneSortParams,
  ) {
    try {
      return await this.request<Milestone[]>('', {
        params: {
          ...filters,
          ...pagination,
          ...sort,
        },
      });
    } catch (error) {
      console.error('Failed to fetch milestones:', {
        filters,
        pagination,
        sort,
        error,
      });
      throw error;
    }
  }

  async get(id: string) {
    return await this.request<Milestone>(`/${id}`);
  }

  async update(id: string, milestone: Partial<Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await this.request<Milestone>(`/${id}`, {
      method: 'PATCH',
      body: milestone,
    });
  }
}

export const milestonesApi = new MilestonesApi();
