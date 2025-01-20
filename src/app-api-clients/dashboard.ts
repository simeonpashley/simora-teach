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
  weeklyPlanning: {
    activitiesThisWeek: number;
    termlyProgress: number;
    missedActivities: number;
  };
  communications: {
    recentCount: number;
    followUpsDue: number;
    parentEngagement: number;
  };
};

export class DashboardApiClient extends BaseApiClient {
  constructor() {
    super('/api/dashboard/metrics');
  }

  async getDashboardMetrics(organizationId: string) {
    const response = await this.request<DashboardMetrics>('', {
      params: { organizationId },
    });
    return response;
  }
}

export const dashboardApiClient = new DashboardApiClient();
