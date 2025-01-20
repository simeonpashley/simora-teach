import { getAuth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

import { dashboardService } from '@/services/DashboardService';
import type { ApiResponse } from '@/types/ApiResponse';
import { ApiError } from '@/utils/apiError';

export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = getAuth(request);
    if (!userId || !orgId) {
      throw ApiError.unauthorized();
    }

    // Get organizationId from query params or fall back to orgId from auth
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || orgId;

    console.info('organizationId', organizationId);
    const metrics = await dashboardService.getDashboardMetrics(organizationId);
    const response: ApiResponse<typeof metrics> = { data: metrics };
    return Response.json(response);
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return ApiError.server(error).toResponse();
  }
}
