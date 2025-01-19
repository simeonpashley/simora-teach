import { dashboardDAO } from '@/dao/DashboardDAO';

export class DashboardService {
  async getDashboardMetrics(organizationId: string) {
    return dashboardDAO.getDashboardMetrics(organizationId);
  }
}

export const dashboardService = new DashboardService();
