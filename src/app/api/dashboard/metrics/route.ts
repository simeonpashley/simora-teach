import { getAuth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

import { dashboardService } from '@/services/DashboardService';
import { ApiError } from '@/utils/apiError';

export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = getAuth(request);
    if (!userId || !orgId) {
      throw ApiError.unauthorized();
    }

    const metrics = await dashboardService.getDashboardMetrics(orgId);
    return Response.json(metrics);
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return ApiError.server(error).toResponse();
  }
}
