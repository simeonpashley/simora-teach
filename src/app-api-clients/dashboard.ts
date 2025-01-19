import { BaseApiClient } from './base';

export type DashboardMetrics = {
  students: {
    total: number;
    senStudents: number;
    eyfsStudents: number;
    activeStudents: number;
    inactiveStudents: number;
  };
  milestones: {
    pending: number;
    completed: number;
    overdue: number;
  };
  ieps: {
    active: number;
    upcomingReviews: number;
    completedGoals: number;
  };
};

export class DashboardApiClient extends BaseApiClient {
  constructor() {
    super('/api/dashboard/metrics');
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await this.request<DashboardMetrics>('');
    return response.data;
  }
}

export const dashboardApiClient = new DashboardApiClient();
