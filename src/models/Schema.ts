import {
  bigint,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

// Organization Table
// Clerk is the source of truth for organizations.
// Clerk data is extended with our data in this table.
export const organizationSchema = pgTable('organization', {
  id: text('id').primaryKey(), // REQUIRED: `text` must be used to match Clerk's organization ID
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  stripeSubscriptionPriceId: text('stripe_subscription_price_id'),
  stripeSubscriptionStatus: text('stripe_subscription_status'),
  stripeSubscriptionCurrentPeriodEnd: bigint(
    'stripe_subscription_current_period_end',
    { mode: 'number' },
  ),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Users are managed inside Clerk.
// NO USER TABLE IS NEEDED.

// Student Table

/**
 * Student Status
 * Type for application enforcement of expected values for student.status.
 * Not constrained  at database level, to allow for future flexibility
 * @enum {string}
 * @readonly
 */
export const StudentStatusEnum = {
  Active: 'Active',
  Inactive: 'Inactive',
  Graduated: 'Graduated',
  EYFS: 'EYFS',
} as const;

export type StudentStatus = typeof StudentStatusEnum[keyof typeof StudentStatusEnum];

/**
 * SEN Status
 * Type for application enforcement of expected values for student.senStatus.
 * Not constrained  at database level, to allow for future flexibility
 * @enum {string}
 * @readonly
 */
export const SENStatusEnum = {
  None: 'None',
  SENSupport: 'SEN Support',
  EHCP: 'EHCP',
} as const;

export type SENStatus = typeof SENStatusEnum[keyof typeof SENStatusEnum];

export const studentSchema = pgTable('student', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').references(() => organizationSchema.id).notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  dateOfBirth: timestamp('date_of_birth', { mode: 'date' }),
  enrollmentDate: timestamp('enrollment_date', { mode: 'date' }),
  status: text('status'), // $type<StudentStatus>() -
  senStatus: text('sen_status'), // $type<SENStatus>() - Not constrained  at database level, to allow for future flexibility
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Communication Log Table
export const communicationLogSchema = pgTable('communication_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').references(() => studentSchema.id).notNull(),
  date: timestamp('date', { mode: 'date' }).notNull(),
  communicationType: text('communication_type').notNull(),
  notes: text('notes'), // Markdown content
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const dataTrackerSchema = pgTable('data_tracker', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').references(() => studentSchema.id).notNull(),
  subject: text('subject').notNull(), // E.g., Maths, Reading, Writing
  metricName: text('metric_name').notNull(), // E.g., Fluency, Geometry
  metricValue: bigint('metric_value', { mode: 'number' }).notNull(),
  recordedAt: timestamp('recorded_at', { mode: 'date' }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const milestoneTrackerSchema = pgTable('milestone_tracker', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').references(() => studentSchema.id).notNull(),
  milestoneName: text('milestone_name').notNull(),
  milestoneCategory: text('milestone_category').notNull(),
  status: text('status').notNull(),
  evidence: text('evidence'), // Markdown or URL
  recordedAt: timestamp('recorded_at', { mode: 'date' }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const termlyPlanningSchema = pgTable('termly_planning', {
  id: uuid('id').defaultRandom().primaryKey(),
  termStart: timestamp('term_start', { mode: 'date' }).notNull(),
  termEnd: timestamp('term_end', { mode: 'date' }).notNull(),
  planDetails: text('plan_details').notNull(), // Markdown content for detailed plans
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const weeklyPlanningSchema = pgTable('weekly_planning', {
  id: uuid('id').defaultRandom().primaryKey(),
  weekStart: timestamp('week_start', { mode: 'date' }).notNull(),
  weekEnd: timestamp('week_end', { mode: 'date' }).notNull(),
  planDetails: text('plan_details').notNull(), // Markdown content for weekly plans
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const iepSchema = pgTable('iep', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').references(() => studentSchema.id).notNull(),
  goalName: text('goal_name').notNull(),
  description: text('description').notNull(),
  progress: bigint('progress', { mode: 'number' }).default(0).notNull(),
  status: text('status').notNull(), // E.g., In Progress, Completed
  evidence: text('evidence'), // Markdown or URL
  startDate: timestamp('start_date', { mode: 'date' }).notNull(),
  endDate: timestamp('end_date', { mode: 'date' }), // Optional: Allows for closure
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const reportSchema = pgTable('report', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').references(() => organizationSchema.id).notNull(),
  studentId: uuid('student_id').references(() => studentSchema.id), // Nullable if it's a group report
  reportType: text('report_type').notNull(), // E.g., "Milestone Report", "IEP Summary"
  content: text('content').notNull(), // Markdown for report content
  generatedAt: timestamp('generated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Additional tables would follow the same pattern for `id` fields.
