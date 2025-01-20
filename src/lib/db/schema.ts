import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
}

export const students = pgTable('students', {
  id: uuid('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  dateOfBirth: timestamp('date_of_birth').notNull(),
  enrollmentDate: timestamp('enrollment_date').notNull(),
  status: text('status', { enum: ['ACTIVE', 'INACTIVE', 'PENDING'] }).notNull(),
  organizationId: text('organization_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
