import { getAuth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

import type { StudentStatus } from '@/dao/StudentDAO';
import type { studentSchema } from '@/models/Schema';
import { studentService } from '@/services/StudentService';
import type { ApiResponse } from '@/types/ApiResponse';
import { ApiError } from '@/utils/apiError';

const validSortColumns = [
  'id',
  'firstName',
  'lastName',
  'dateOfBirth',
  'enrollmentDate',
  'status',
  'createdAt',
  'updatedAt',
] as const;

const querySchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.enum(validSortColumns).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Handle CORS preflight requests
export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = getAuth(request);
    if (!userId || !orgId) {
      throw ApiError.unauthorized();
    }

    const { searchParams } = new URL(request.url);
    const validationResult = querySchema.safeParse(Object.fromEntries(searchParams));

    if (!validationResult.success) {
      throw ApiError.validation(validationResult.error);
    }

    const { page, pageSize, search, status, sortBy, sortOrder } = validationResult.data;

    const filters = {
      ...(search && { search }),
      ...(status && { status: status as StudentStatus }),
    };

    const pagination = page && pageSize ? { page, pageSize } : undefined;
    const sort = sortBy && sortOrder
      ? { sortBy: sortBy as keyof typeof studentSchema.$inferSelect, sortOrder }
      : undefined;

    const result = await studentService.getStudents(filters, pagination, sort);
    const response: ApiResponse<typeof result.data> = {
      data: result.data,
      ...(result.pagination && { pagination: result.pagination }),
    };
    return Response.json(response);
  } catch (error) {
    console.error('Error fetching students:', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return ApiError.server(error).toResponse();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, orgId } = getAuth(request);
    if (!userId || !orgId) {
      throw ApiError.unauthorized();
    }

    const body = await request.json();
    const { ids } = z.object({
      ids: z.array(z.string()),
    }).parse(body);

    await studentService.deleteStudents(ids);
    const response: ApiResponse<{ success: true }> = { data: { success: true } };
    return Response.json(response);
  } catch (error) {
    console.error('Error deleting students:', error);

    if (error instanceof z.ZodError) {
      return ApiError.validation(error).toResponse();
    }

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return ApiError.server(error).toResponse();
  }
}
