import { faker } from '@faker-js/faker';

import { db } from '@/lib/db';
import {
  communicationLogSchema,
  dataTrackerSchema,
  iepSchema,
  milestoneTrackerSchema,
  organizationSchema,
  SENStatusEnum,
  studentSchema,
  StudentStatusEnum,
  termlyPlanningSchema,
  weeklyPlanningSchema,
} from '@/models/Schema';
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

export async function seedOrganization(clerkId: string) {
  try {
    if (!clerkId) {
      throw new Error('Clerk ID is required');
    }
    console.log('Starting database seed...');

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

    // Seed Organizations
    const organization = await db
      .insert(organizationSchema)
      .values({
        id: clerkId,
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
          status: faker.helpers.arrayElement([
            StudentStatusEnum.Active,
            StudentStatusEnum.Inactive,
            StudentStatusEnum.EYFS,
          ]),
          senStatus: faker.helpers.arrayElement([
            SENStatusEnum.SENSupport,
            SENStatusEnum.None,
            SENStatusEnum.None,
          ]), // 1/3 chance of being SEN
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
        status: faker.helpers.arrayElement(['in_progress', 'completed']),
        evidence: faker.helpers.arrayElement([faker.internet.url(), faker.lorem.sentence()]),
        dueDate: randomDate(new Date('2024-09-01'), new Date('2025-07-23')),
        startDate: randomDate(new Date('2024-01-01'), new Date('2024-08-31')),
      }));

      await db.insert(iepSchema).values(iepGoals);
    }

    // Seed Milestone Trackers
    for (const studentId of studentIds) {
      const milestones = Array.from({ length: 5 }, () => ({
        studentId,
        milestoneName: faker.lorem.words(3),
        milestoneCategory: faker.helpers.arrayElement(['Academic', 'Social', 'Physical']),
        status: faker.helpers.arrayElement(['Emerging', 'Secure']),
        expectedCompletionDate: randomDate(new Date('2024-09-01'), new Date('2025-07-23')),
        severity: faker.helpers.arrayElement(['High', 'Medium', 'Low']),
        evidence: faker.lorem.sentence(),
      }));

      await db.insert(milestoneTrackerSchema).values(milestones);
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
    return { success: true };
  } catch (error) {
    console.error('Error seeding organization:', error);
    throw new Error('Failed to seed organization');
  }
}
