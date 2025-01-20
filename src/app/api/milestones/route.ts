import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { milestoneTrackerSchema, studentSchema } from '@/models/Schema';

// Type guard to check if a column exists in the milestone schema
function isMilestoneColumn(key: string): key is keyof typeof milestoneTrackerSchema {
  return key in milestoneTrackerSchema && typeof milestoneTrackerSchema[key as keyof typeof milestoneTrackerSchema] === 'object';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 10;
    const sortBy = searchParams.get('sortBy') || 'milestoneName';
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';

    // Build conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(milestoneTrackerSchema.milestoneName, `%${search}%`),
          ilike(studentSchema.firstName, `%${search}%`),
          ilike(studentSchema.lastName, `%${search}%`),
        ),
      );
    }

    if (category) {
      conditions.push(eq(milestoneTrackerSchema.milestoneCategory, category));
    }

    if (status) {
      conditions.push(eq(milestoneTrackerSchema.status, status));
    }

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<string>`count(*)` })
      .from(milestoneTrackerSchema)
      .leftJoin(studentSchema, eq(milestoneTrackerSchema.studentId, studentSchema.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .execute()
      .then(result => result[0]?.count ?? 0);

    // Build and execute main query
    const query = db
      .select({
        id: milestoneTrackerSchema.id,
        studentId: milestoneTrackerSchema.studentId,
        studentName: sql<string>`${studentSchema.firstName} || ' ' || ${studentSchema.lastName}`,
        milestoneName: milestoneTrackerSchema.milestoneName,
        milestoneCategory: milestoneTrackerSchema.milestoneCategory,
        status: milestoneTrackerSchema.status,
        evidence: milestoneTrackerSchema.evidence,
        recordedAt: milestoneTrackerSchema.recordedAt,
        createdAt: milestoneTrackerSchema.createdAt,
        updatedAt: milestoneTrackerSchema.updatedAt,
      })
      .from(milestoneTrackerSchema)
      .leftJoin(studentSchema, eq(milestoneTrackerSchema.studentId, studentSchema.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Handle sorting
    if (sortBy === 'studentName') {
      query.orderBy(
        sortOrder === 'desc'
          ? desc(sql<string>`${studentSchema.firstName} || ' ' || ${studentSchema.lastName}`)
          : asc(sql<string>`${studentSchema.firstName} || ' ' || ${studentSchema.lastName}`),
      );
    } else if (isMilestoneColumn(sortBy)) {
      const column = milestoneTrackerSchema[sortBy] as PgColumn;
      query.orderBy(sortOrder === 'desc' ? desc(column) : asc(column));
    }

    // Apply pagination
    query.limit(pageSize).offset((page - 1) * pageSize);

    const milestones = await query;

    return NextResponse.json({
      data: milestones,
      pagination: {
        total: Number(totalCount),
        pageSize,
        page,
        totalPages: Math.ceil(Number(totalCount) / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return NextResponse.json(
      { error: 'Failed to fetch milestones' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const milestoneId = searchParams.get('id');

    if (!milestoneId) {
      return NextResponse.json(
        { error: 'Milestone ID is required' },
        { status: 400 },
      );
    }

    const milestone = await db
      .select()
      .from(milestoneTrackerSchema)
      .where(eq(milestoneTrackerSchema.id, milestoneId))
      .limit(1)
      .then(results => results[0]);

    if (!milestone) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404 },
      );
    }

    const updatedMilestone = await db
      .update(milestoneTrackerSchema)
      .set({
        ...milestone,
        updatedAt: new Date(),
      })
      .where(eq(milestoneTrackerSchema.id, milestoneId))
      .returning();

    return NextResponse.json(updatedMilestone[0]);
  } catch (error) {
    console.error('Error updating milestone:', error);
    return NextResponse.json(
      { error: 'Failed to update milestone' },
      { status: 500 },
    );
  }
}
