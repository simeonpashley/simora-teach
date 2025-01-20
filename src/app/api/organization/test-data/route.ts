import { getAuth } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';

import { seedOrganization } from '@/services/organization/seedOrganization';
import type { ApiResponse } from '@/types/ApiResponse';
import { ApiError } from '@/utils/apiError';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<{ message: string }>>> {
  try {
    const { userId, orgId } = getAuth(request);
    if (!userId || !orgId) {
      throw ApiError.unauthorized();
    }
    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 },
      );
    }

    await seedOrganization(orgId);

    return NextResponse.json(
      { data: { message: 'Test data created successfully' } },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error creating test data:', error);
    return NextResponse.json(
      { error: 'Failed to create test data' },
      { status: 500 },
    );
  }
}
