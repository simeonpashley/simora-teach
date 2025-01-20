/**
 * This file is used to seed the database with mock data.
 *
 * ----------------------------------------
 * This script prepopulates the database with realistic mock data to support
 * the Minimum Loveable Product (MLP) for Rose by Simora. The data enables
 * testing and demonstration of key features such as student management,
 * milestones tracking, IEP management, communication logs, and reporting.
 *
 * Usage:
 *reportSchema,
   Run this script to seed the database in development or testing environments:
 *
 *    pnpm exec ts-node lib/seed.ts
 */

import { faker } from '@faker-js/faker';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import {
  communicationLogSchema,
  dataTrackerSchema,
  iepSchema,
  milestoneTrackerSchema,
  organizationSchema,
  studentSchema,
  termlyPlanningSchema,
  weeklyPlanningSchema,
} from '../src/models/Schema';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

// Helper Functions
const randomDate = (start: Date, end: Date) => faker.date.between({ from: start, to: end });
const randomScore = () => faker.number.int({ min: 60, max: 100 });

const termDates = [
  { name: 'Term 1', start: new Date('2024-09-03'), end: new Date('2024-10-25') },
  { name: 'Term 2', start: new Date('2024-11-04'), end: new Date('2024-12-20') },
  { name: 'Term 3', start: new Date('2025-01-06'), end: new Date('2025-02-14') },
  { name: 'Term 4', start: new Date('2025-02-24'), end: new Date('2025-04-04') },
  { name: 'Term 5', start: new Date('2025-04-22'), end: new Date('2025-05-23') },
  { name: 'Term 6', start: new Date('2025-06-02'), end: new Date('2025-07-23') },
];

// Generate Weekly Dates
function generateWeeklyDates(termStart: Date, termEnd: Date) {
  const weeks = [];
  let currentStart = new Date(termStart);

  while (currentStart < termEnd) {
    const weekEnd = new Date(currentStart);
    weekEnd.setDate(weekEnd.getDate() + 4); // Assume weeks end on Friday

    if (weekEnd > termEnd) {
      weeks.push({ start: currentStart, end: termEnd });
    } else {
      weeks.push({ start: currentStart, end: weekEnd });
    }

    currentStart = new Date(currentStart);
    currentStart.setDate(currentStart.getDate() + 7); // Move to the next week
  }

  return weeks;
}

async function seed() {
  try {
    console.log('Starting database seed...');

    await db.execute(sql`DROP TABLE IF EXISTS report;`); // legacy table hanging around
    console.log('Truncating tables in dependency order...');

    // Delete dependent child tables first
    await db.delete(dataTrackerSchema);
    await db.delete(milestoneTrackerSchema);
    await db.delete(iepSchema);
    await db.delete(communicationLogSchema);
    await db.delete(weeklyPlanningSchema);
    await db.delete(termlyPlanningSchema);

    // Delete parent tables
    await db.delete(studentSchema);
    await db.delete(organizationSchema);

    console.log('Tables truncated.');

    const clerkId = 'org_2rm1qb49cFwGSTzgCKf3hYBFdx4';
    // Seed Organizations
    const organization = await db
      .insert(organizationSchema)
      .values({
        clerkId,
        stripeCustomerId: faker.string.uuid(),
        stripeSubscriptionId: faker.string.uuid(),
        stripeSubscriptionPriceId: faker.string.uuid(),
        stripeSubscriptionStatus: 'active',
      })
      .returning({ id: organizationSchema.id });
    const organizationId = organization[0]?.id ?? 'organization-1';

    // Seed Students
    const students = await db
      .insert(studentSchema)
      .values(
        Array.from({ length: 50 }, () => ({
          organizationId,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          dateOfBirth: randomDate(new Date('2010-01-01'), new Date('2015-12-31')),
          enrollmentDate: randomDate(new Date('2020-01-01'), new Date('2023-01-01')),
          status: faker.helpers.arrayElement(['active', 'inactive']),
        })),
      )
      .returning({ id: studentSchema.id });
    const studentIds = students.map(s => s.id);

    // Seed Data Trackers
    for (const studentId of studentIds) {
      const trackerDate = new Date();
      await db.insert(dataTrackerSchema).values([
        { studentId, subject: 'Maths', metricName: 'Geometry', metricValue: randomScore(), recordedAt: trackerDate },
        { studentId, subject: 'Reading', metricName: 'Fluency', metricValue: randomScore(), recordedAt: trackerDate },
        { studentId, subject: 'Writing', metricName: 'Grammar', metricValue: randomScore(), recordedAt: trackerDate },
      ]);
    }

    // Seed IEPs
    for (const studentId of studentIds) {
      const iepGoals = Array.from({ length: 3 }, () => ({
        studentId,
        goalName: faker.lorem.words(5),
        description: faker.lorem.paragraph(),
        progress: faker.number.int({ min: 0, max: 100 }),
        status: faker.helpers.arrayElement(['In Progress', 'Completed']),
        evidence: faker.helpers.arrayElement([faker.internet.url(), faker.lorem.sentence()]),
        dueDate: randomDate(new Date('2024-09-01'), new Date('2025-07-23')),
        startDate: randomDate(new Date('2024-01-01'), new Date('2024-08-31')),
      }));

      await db.insert(iepSchema).values(iepGoals);
    }

    // Seed Termly and Weekly Planning
    for (const term of termDates) {
      await db.insert(termlyPlanningSchema).values({
        termStart: term.start,
        termEnd: term.end,
        planDetails: faker.lorem.paragraph(2),
      });

      const weeks = generateWeeklyDates(term.start, term.end);
      const weeklyPlans = weeks.map(week => ({
        weekStart: week.start,
        weekEnd: week.end,
        planDetails: `Activities: ${faker.lorem.sentence()}`,
      }));
      await db.insert(weeklyPlanningSchema).values(weeklyPlans);
    }

    console.log('Seeding completed.');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await pool.end();
  }
}

seed();
