import {
  bigint,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// The migration is automatically applied during the next database interaction,
// so there's no need to run it manually or restart the Next.js server.

export const organizationSchema = pgTable(
  'organization',
  {
    id: text('id').primaryKey(),
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
  },
  (table) => {
    return {
      stripeCustomerIdIdx: uniqueIndex('stripe_customer_id_idx').on(
        table.stripeCustomerId,
      ),
    };
  },
);

export const todoSchema = pgTable('todo', {
  id: serial('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Hub Table
export const hubSchema = pgTable('hub', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Student Overview Table
export const studentOverviewSchema = pgTable('student_overview', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  dateOfBirth: timestamp('date_of_birth', { mode: 'date' }),
  enrollmentDate: timestamp('enrollment_date', { mode: 'date' }),
  status: text('status'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Communication Log Table
export const communicationLogSchema = pgTable('communication_log', {
  id: serial('id').primaryKey(),
  studentId: serial('student_id').references(() => studentOverviewSchema.id),
  date: timestamp('date', { mode: 'date' }).notNull(),
  communicationType: text('communication_type'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Weekly Planning Table
export const weeklyPlanningSchema = pgTable('weekly_planning', {
  id: serial('id').primaryKey(),
  weekStart: timestamp('week_start', { mode: 'date' }).notNull(),
  weekEnd: timestamp('week_end', { mode: 'date' }).notNull(),
  planDetails: text('plan_details'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Termly Planning Table
export const termlyPlanningSchema = pgTable('termly_planning', {
  id: serial('id').primaryKey(),
  termStart: timestamp('term_start', { mode: 'date' }).notNull(),
  termEnd: timestamp('term_end', { mode: 'date' }).notNull(),
  planDetails: text('plan_details'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Subject Overviews
export const mathsOverviewSchema = pgTable('maths_overview', {
  id: serial('id').primaryKey(),
  studentId: serial('student_id').references(() => studentOverviewSchema.id),
  overview: text('overview'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const readingOverviewSchema = pgTable('reading_overview', {
  id: serial('id').primaryKey(),
  studentId: serial('student_id').references(() => studentOverviewSchema.id),
  overview: text('overview'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const writingOverviewSchema = pgTable('writing_overview', {
  id: serial('id').primaryKey(),
  studentId: serial('student_id').references(() => studentOverviewSchema.id),
  overview: text('overview'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Data Trackers
export const mathsDataTrackerSchema = pgTable('maths_data_tracker', {
  id: serial('id').primaryKey(),
  studentId: serial('student_id').references(() => studentOverviewSchema.id),
  metricName: text('metric_name'),
  metricValue: bigint('metric_value', { mode: 'number' }),
  recordedAt: timestamp('recorded_at', { mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const readingDataTrackerSchema = pgTable('reading_data_tracker', {
  id: serial('id').primaryKey(),
  studentId: serial('student_id').references(() => studentOverviewSchema.id),
  metricName: text('metric_name'),
  metricValue: bigint('metric_value', { mode: 'number' }),
  recordedAt: timestamp('recorded_at', { mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Phonics Data Tracker
export const rwiPhonicsDataTrackerSchema = pgTable('rwi_phonics_data_tracker', {
  id: serial('id').primaryKey(),
  studentId: serial('student_id').references(() => studentOverviewSchema.id),
  metricName: text('metric_name'),
  metricValue: bigint('metric_value', { mode: 'number' }),
  recordedAt: timestamp('recorded_at', { mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Writing Data Tracker
export const writingDataTrackerSchema = pgTable('writing_data_tracker', {
  id: serial('id').primaryKey(),
  studentId: serial('student_id').references(() => studentOverviewSchema.id),
  metricName: text('metric_name'),
  metricValue: bigint('metric_value', { mode: 'number' }),
  recordedAt: timestamp('recorded_at', { mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
