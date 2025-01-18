import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { studentOverviewSchema } from '@/models/Schema';

export type SortOrder = 'asc' | 'desc';

export type StudentFilters = {
  search?: string;
  status?: string;
};

export type PaginationParams = {
  page: number;
  pageSize: number;
};

export type SortParams = {
  sortBy: keyof typeof studentOverviewSchema.$inferSelect;
  sortOrder: SortOrder;
};

export class StudentDAO {
  async findAll(
    filters: StudentFilters = {},
    pagination?: PaginationParams,
    sort?: SortParams,
  ) {
    // Build conditions
    const conditions = [];
    if (filters.search) {
      conditions.push(
        or(
          ilike(studentOverviewSchema.firstName, `%${filters.search}%`),
          ilike(studentOverviewSchema.lastName, `%${filters.search}%`),
        ),
      );
    }
    if (filters.status) {
      conditions.push(eq(studentOverviewSchema.status, filters.status));
    }

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(studentOverviewSchema)
      .execute()
      .then(result => result[0]?.count ?? 0);

    // Build and execute main query
    const query = db
      .select()
      .from(studentOverviewSchema)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(
        sort
          ? (sort.sortOrder === 'desc' ? desc : asc)(
              studentOverviewSchema[sort.sortBy],
            )
          : asc(studentOverviewSchema.id),
      );

    // Apply pagination if provided
    const students = await (pagination
      ? query
          .limit(pagination.pageSize)
          .offset((pagination.page - 1) * pagination.pageSize)
      : query);

    return {
      data: students,
      pagination: pagination
        ? {
            total: totalCount,
            pageSize: pagination.pageSize,
            page: pagination.page,
            totalPages: Math.ceil(totalCount / pagination.pageSize),
          }
        : undefined,
    };
  }

  async findById(id: number) {
    const result = await db
      .select()
      .from(studentOverviewSchema)
      .where(eq(studentOverviewSchema.id, id))
      .limit(1);
    return result[0];
  }

  async deleteMany(ids: number[]) {
    await db
      .delete(studentOverviewSchema)
      .where(
        or(...ids.map(id => eq(studentOverviewSchema.id, id))),
      );
  }
}

export const studentDAO = new StudentDAO();
