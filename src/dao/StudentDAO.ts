import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { studentSchema } from '@/models/Schema';

export type SortOrder = 'asc' | 'desc';
export type StudentStatus = 'active' | 'inactive' | 'pending';

export type Student = typeof studentSchema.$inferSelect;

/**
 * StudentFilters type
 * search - search term
 * status - status of the student (active, inactive, pending)
 *
 * @description Filters for student data
 */
export type StudentFilters = {
  search?: string;
  status?: StudentStatus;
};

export type PaginationParams = {
  page: number; // one based
  pageSize: number;
};

export type SortParams = {
  sortBy: keyof typeof studentSchema.$inferSelect;
  sortOrder: SortOrder;
};

/**
 * StudentDAO class
 * @description Data Access Object for student data
 */
export class StudentDAO {
  /**
   * Find all students
   * @param filters - filters to apply to the query
   * @param pagination - pagination parameters
   * @param sort - sort parameters
   * @returns an object containing the students and pagination information
   * {
          data: Student[];
          pagination?: Pagination;
      }
   *
   */
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
          ilike(studentSchema.firstName, `%${filters.search}%`),
          ilike(studentSchema.lastName, `%${filters.search}%`),
        ),
      );
    }
    if (filters.status) {
      conditions.push(eq(studentSchema.status, filters.status));
    }

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<string>`count(*)` }) // count(*) returns a string
      .from(studentSchema)
      .execute()
      .then(result => result[0]?.count ?? 0);

    // Build and execute main query
    const query = db
      .select()
      .from(studentSchema)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(
        sort
          ? (sort.sortOrder === 'desc' ? desc : asc)(
              studentSchema[sort.sortBy],
            )
          : asc(studentSchema.id),
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
            total: Number(totalCount),
            pageSize: pagination.pageSize,
            page: pagination.page, // one based
            totalPages: Math.ceil(Number(totalCount) / pagination.pageSize), // one based
          }
        : undefined,
    };
  }

  async findById(id: string) {
    const result = await db
      .select()
      .from(studentSchema)
      .where(eq(studentSchema.id, id))
      .limit(1);
    return result[0];
  }

  async deleteMany(ids: string[]) {
    await db
      .delete(studentSchema)
      .where(
        or(...ids.map(id => eq(studentSchema.id, id))),
      );
  }
}

export const studentDAO = new StudentDAO();
