import { and, count, eq, gte, lte, sql } from 'drizzle-orm';

import { db } from '@/libs/DB';
import {
  communicationLogSchema,
  iepSchema,
  milestoneTrackerSchema,
  SENStatusEnum,
  studentSchema,
  StudentStatusEnum,
  termlyPlanningSchema,
  weeklyPlanningSchema,
} from '@/models/Schema';

type CountResult<T extends string> = { [K in T]: number };

type DashboardMetrics = {
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

export class DashboardDAO {
  async getDashboardMetrics(organizationId: string): Promise<DashboardMetrics> {
    const [
      { total },
      { senStudents },
      { eyfsStudents },
      { activeStudents },
      { inactiveStudents },
      { pendingMilestones },
      { completedMilestones },
      { overdueMilestones },
      { activeIeps },
      { upcomingReviews },
      { completedGoals },
      { activitiesThisWeek },
      { termlyProgress },
      { missedActivities },
      { recentCommunications },
      { followUpsDue },
      { parentEngagement },
    ] = await Promise.all([
      // Total number of students
      db
        .select({ total: count() })
        .from(studentSchema)
        .where(eq(studentSchema.organizationId, organizationId))
        .then((result: CountResult<'total'>[]) => result[0] ?? { total: 0 }),

      // Number of students with SEN designations
      db
        .select({ senStudents: count() })
        .from(studentSchema)
        .where(
          and(
            eq(studentSchema.organizationId, organizationId),
            eq(studentSchema.senStatus, SENStatusEnum.SENSupport),
          ),
        )
        .then((result: CountResult<'senStudents'>[]) => result[0] ?? { senStudents: 0 }),

      // Number of EYFS students
      db
        .select({ eyfsStudents: count() })
        .from(studentSchema)
        .where(
          and(
            eq(studentSchema.organizationId, organizationId),
            eq(studentSchema.status, StudentStatusEnum.EYFS),
          ),
        )
        .then((result: CountResult<'eyfsStudents'>[]) => result[0] ?? { eyfsStudents: 0 }),

      // Number of active students
      db
        .select({ activeStudents: count() })
        .from(studentSchema)
        .where(
          and(
            eq(studentSchema.organizationId, organizationId),
            eq(studentSchema.status, StudentStatusEnum.Active),
          ),
        )
        .then((result: CountResult<'activeStudents'>[]) => result[0] ?? { activeStudents: 0 }),

      // Number of inactive students
      db
        .select({ inactiveStudents: count() })
        .from(studentSchema)
        .where(
          and(
            eq(studentSchema.organizationId, organizationId),
            eq(studentSchema.status, StudentStatusEnum.Inactive),
          ),
        )
        .then((result: CountResult<'inactiveStudents'>[]) => result[0] ?? { inactiveStudents: 0 }),

      // Count of pending milestones
      db
        .select({ pendingMilestones: count() })
        .from(milestoneTrackerSchema)
        .innerJoin(
          studentSchema,
          eq(milestoneTrackerSchema.studentId, studentSchema.id),
        )
        .where(
          and(
            eq(studentSchema.organizationId, organizationId),
            eq(milestoneTrackerSchema.status, 'Emerging'),
          ),
        )
        .then((result: CountResult<'pendingMilestones'>[]) => result[0] ?? { pendingMilestones: 0 }),

      // Count of completed milestones
      db
        .select({ completedMilestones: count() })
        .from(milestoneTrackerSchema)
        .innerJoin(
          studentSchema,
          eq(milestoneTrackerSchema.studentId, studentSchema.id),
        )
        .where(
          and(
            eq(studentSchema.organizationId, organizationId),
            eq(milestoneTrackerSchema.status, 'Secure'),
          ),
        )
        .then((result: CountResult<'completedMilestones'>[]) => result[0] ?? { completedMilestones: 0 }),

      // Count of overdue milestones
      db
        .select({ overdueMilestones: count() })
        .from(milestoneTrackerSchema)
        .innerJoin(
          studentSchema,
          eq(milestoneTrackerSchema.studentId, studentSchema.id),
        )
        .where(
          and(
            eq(studentSchema.organizationId, organizationId),
            eq(milestoneTrackerSchema.status, 'Emerging'),
            // Add overdue condition based on your schema
          ),
        )
        .then((result: CountResult<'overdueMilestones'>[]) => result[0] ?? { overdueMilestones: 0 }),

      // Count of active IEPs
      db
        .select({ activeIeps: count() })
        .from(iepSchema)
        .innerJoin(studentSchema, eq(iepSchema.studentId, studentSchema.id))
        .where(
          and(
            eq(studentSchema.organizationId, organizationId),
            eq(iepSchema.status, 'in_progress'),
          ),
        )
        .then((result: CountResult<'activeIeps'>[]) => result[0] ?? { activeIeps: 0 }),

      // Count of IEPs with upcoming reviews
      db
        .select({ upcomingReviews: count() })
        .from(iepSchema)
        .innerJoin(studentSchema, eq(iepSchema.studentId, studentSchema.id))
        .where(
          and(
            eq(studentSchema.organizationId, organizationId),
            eq(iepSchema.status, 'in_progress'),
            // Add condition for upcoming reviews based on your schema
          ),
        )
        .then((result: CountResult<'upcomingReviews'>[]) => result[0] ?? { upcomingReviews: 0 }),

      // Count of completed IEP goals
      db
        .select({ completedGoals: count() })
        .from(iepSchema)
        .innerJoin(studentSchema, eq(iepSchema.studentId, studentSchema.id))
        .where(
          and(
            eq(studentSchema.organizationId, organizationId),
            eq(iepSchema.status, 'completed'),
          ),
        )
        .then((result: CountResult<'completedGoals'>[]) => result[0] ?? { completedGoals: 0 }),

      // Count of activities this week
      db
        .select({ activitiesThisWeek: count() })
        .from(weeklyPlanningSchema)
        .where(
          and(
            gte(weeklyPlanningSchema.weekStart, sql`date_trunc('week', CURRENT_DATE)`),
            lte(weeklyPlanningSchema.weekEnd, sql`date_trunc('week', CURRENT_DATE) + interval '7 days'`),
          ),
        )
        .then((result: CountResult<'activitiesThisWeek'>[]) => result[0] ?? { activitiesThisWeek: 0 }),

      // Termly progress percentage - calculate percentage of termly objectives marked as "On Track"
      db
        .select({
          termlyProgress: sql<number>`
            ROUND(
              (COUNT(CASE WHEN ${termlyPlanningSchema.planDetails} ILIKE '%[x]%' THEN 1 END)::float /
              NULLIF(COUNT(*)::float, 0)) * 100
            )
          `,
        })
        .from(termlyPlanningSchema)
        .where(
          and(
            gte(termlyPlanningSchema.termStart, sql`date_trunc('month', CURRENT_DATE - interval '3 months')`),
            lte(termlyPlanningSchema.termEnd, sql`date_trunc('month', CURRENT_DATE + interval '3 months')`),
          ),
        )
        .then(result => result[0] ?? { termlyProgress: 0 }),

      // Count of missed activities
      db
        .select({ missedActivities: count() })
        .from(weeklyPlanningSchema)
        .where(
          and(
            lte(weeklyPlanningSchema.weekEnd, sql`CURRENT_DATE`),
            sql`${weeklyPlanningSchema.planDetails} NOT ILIKE '%[x]%'`,
          ),
        )
        .then((result: CountResult<'missedActivities'>[]) => result[0] ?? { missedActivities: 0 }),

      // Count of recent communications (last 7 days)
      db
        .select({ recentCommunications: count() })
        .from(communicationLogSchema)
        .where(
          gte(communicationLogSchema.date, sql`CURRENT_DATE - interval '7 days'`),
        )
        .then((result: CountResult<'recentCommunications'>[]) => result[0] ?? { recentCommunications: 0 }),

      // Count of follow-ups due this week
      db
        .select({ followUpsDue: count() })
        .from(communicationLogSchema)
        .where(
          and(
            sql`${communicationLogSchema.notes} ILIKE '%TODO%' OR ${communicationLogSchema.notes} ILIKE '%FOLLOW-UP%'`,
            gte(communicationLogSchema.date, sql`date_trunc('week', CURRENT_DATE)`),
            lte(communicationLogSchema.date, sql`date_trunc('week', CURRENT_DATE) + interval '7 days'`),
          ),
        )
        .then((result: CountResult<'followUpsDue'>[]) => result[0] ?? { followUpsDue: 0 }),

      // Parent engagement percentage (last 30 days)
      db
        .select({
          parentEngagement: sql<number>`
            ROUND(
              (COUNT(DISTINCT ${studentSchema.id})::float /
              NULLIF((SELECT COUNT(*) FROM ${studentSchema} WHERE ${studentSchema.status} = ${StudentStatusEnum.Active})::float, 0)) * 100
            )
          `,
        })
        .from(communicationLogSchema)
        .innerJoin(
          studentSchema,
          eq(communicationLogSchema.studentId, studentSchema.id),
        )
        .where(
          and(
            gte(communicationLogSchema.date, sql`CURRENT_DATE - interval '30 days'`),
            eq(studentSchema.status, StudentStatusEnum.Active),
          ),
        )
        .then(result => result[0] ?? { parentEngagement: 0 }),
    ]);

    return {
      students: {
        total,
        senStudents,
        eyfsStudents,
        activeStudents,
        inactiveStudents,
      },
      milestones: {
        pending: pendingMilestones,
        completed: completedMilestones,
        overdue: overdueMilestones,
      },
      ieps: {
        active: activeIeps,
        upcomingReviews,
        completedGoals,
      },
      weeklyPlanning: {
        activitiesThisWeek,
        termlyProgress,
        missedActivities,
      },
      communications: {
        recentCount: recentCommunications,
        followUpsDue,
        parentEngagement,
      },
    };
  }
}

export const dashboardDAO = new DashboardDAO();
