import { faker } from '@faker-js/faker';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import {
  communicationLogSchema,
  hubSchema,
  mathsDataTrackerSchema,
  mathsOverviewSchema,
  readingDataTrackerSchema,
  readingOverviewSchema,
  rwiPhonicsDataTrackerSchema,
  studentOverviewSchema,
  termlyPlanningSchema,
  weeklyPlanningSchema,
  writingDataTrackerSchema,
  writingOverviewSchema,
} from '../src/models/Schema';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Parse and mask sensitive parts of the database URL
const dbUrl = new URL(process.env.DATABASE_URL);
const maskedDbUrl = `${dbUrl.protocol}//${dbUrl.username}:****@${dbUrl.host}${dbUrl.pathname}`;
console.log('Using database configuration:', maskedDbUrl);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Enhanced database validation
async function validateConnection() {
  let client;
  try {
    console.log('Validating database connection...');
    client = await pool.connect();

    // Check if we can query
    console.log('Testing database query...');
    await client.query('SELECT NOW()');

    // Check if key tables exist
    console.log('Checking if database tables exist...');
    const tableCheck = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('hub', 'student_overview', 'weekly_planning')
    `);

    if (tableCheck.rows.length === 0) {
      throw new Error('Required tables not found in database. Have you run the migrations?');
    }

    console.log(`Found ${tableCheck.rows.length} required tables`);
    console.log('Database validation successful');
    return true;
  } catch (error) {
    console.error('Database validation failed:', error);
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
}

const db = drizzle(pool);

// UK Term dates for 2024/2025
const termDates = [
  { name: 'Term 1', start: new Date('2024-09-03'), end: new Date('2024-10-25') },
  { name: 'Term 2', start: new Date('2024-11-04'), end: new Date('2024-12-20') },
  { name: 'Term 3', start: new Date('2025-01-06'), end: new Date('2025-02-14') },
  { name: 'Term 4', start: new Date('2025-02-24'), end: new Date('2025-04-04') },
  { name: 'Term 5', start: new Date('2025-04-22'), end: new Date('2025-05-23') },
  { name: 'Term 6', start: new Date('2025-06-02'), end: new Date('2025-07-23') },
];

// Helper function to generate a random date within a range
function randomDate(start: Date, end: Date) {
  return faker.date.between({ from: start, to: end });
}

// Helper function to generate a random score between 60 and 100
function randomScore() {
  return faker.number.int({ min: 60, max: 100 });
}

// Helper function to generate weekly dates within a term
function generateWeeklyDates(termStart: Date, termEnd: Date) {
  const weeks = [];
  let currentStart = new Date(termStart);

  while (currentStart < termEnd) {
    const weekEnd = new Date(currentStart);
    weekEnd.setDate(weekEnd.getDate() + 4); // Friday of the same week

    if (weekEnd > termEnd) {
      weeks.push({ start: currentStart, end: termEnd });
    } else {
      weeks.push({ start: currentStart, end: weekEnd });
    }

    currentStart = new Date(currentStart);
    currentStart.setDate(currentStart.getDate() + 7);
  }

  return weeks;
}

async function seed() {
  // Validate database connection before proceeding
  const isConnected = await validateConnection();
  if (!isConnected) {
    console.error('Unable to proceed with seeding due to database connection issues');
    process.exit(1);
  }

  try {
    console.log('Starting database seed...');

    // Truncate all tables first, in order of dependencies
    console.log('Truncating existing data...');
    // Delete child tables first (data trackers)
    console.log('Deleting data trackers...');
    await db.delete(mathsDataTrackerSchema);
    await db.delete(readingDataTrackerSchema);
    await db.delete(rwiPhonicsDataTrackerSchema);
    await db.delete(writingDataTrackerSchema);
    await db.delete(communicationLogSchema);

    // Delete overview tables
    console.log('Deleting overviews...');
    await db.delete(mathsOverviewSchema);
    await db.delete(readingOverviewSchema);
    await db.delete(writingOverviewSchema);

    // Delete planning tables
    console.log('Deleting planning data...');
    await db.delete(weeklyPlanningSchema);
    await db.delete(termlyPlanningSchema);

    // Delete main tables
    console.log('Deleting main tables...');
    await db.delete(studentOverviewSchema);
    await db.delete(hubSchema);

    console.log('All tables truncated.');

    // Seed Hub
    console.log('Seeding hubs...');
    const hubs = await db.insert(hubSchema).values([
      { name: faker.company.name(), description: faker.company.catchPhrase() },
      { name: faker.company.name(), description: faker.company.catchPhrase() },
    ]).returning();

    if (!hubs || hubs.length === 0) {
      throw new Error('Failed to insert hubs');
    }

    // Generate 10 students
    console.log('Seeding students...');
    const studentData = Array.from({ length: 100 }, () => ({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      dateOfBirth: randomDate(new Date('2013-09-01'), new Date('2014-08-31')),
      enrollmentDate: new Date('2024-09-03'),
      status: faker.helpers.arrayElement(['Active', 'Inactive', 'Pending']) as 'Active' | 'Inactive' | 'Pending',
    }));

    const students = await db.insert(studentOverviewSchema)
      .values(studentData)
      .returning({ id: studentOverviewSchema.id });

    if (!students || students.length === 0) {
      throw new Error('Failed to insert students');
    }

    console.log(`Successfully created ${students.length} students`);

    // Generate termly planning entries
    const termlyPlanningData = termDates.map(term => ({
      termStart: term.start,
      termEnd: term.end,
      planDetails: `${term.name} - ${faker.lorem.paragraphs(2)}`,
    }));

    await db.insert(termlyPlanningSchema).values(termlyPlanningData);

    // Generate weekly planning entries for each term
    const weeklyPlanningData = termDates.flatMap((term) => {
      const weeks = generateWeeklyDates(term.start, term.end);
      return weeks.map(week => ({
        weekStart: week.start,
        weekEnd: week.end,
        planDetails: `Week ${faker.number.int({ min: 1, max: 6 })} - ${faker.lorem.paragraph()}`,
      }));
    });

    await db.insert(weeklyPlanningSchema).values(weeklyPlanningData);

    // Generate overviews for each student
    for (const student of students) {
      await db.insert(mathsOverviewSchema).values({
        studentId: student.id,
        overview: faker.lorem.paragraph(),
      });

      await db.insert(readingOverviewSchema).values({
        studentId: student.id,
        overview: faker.lorem.paragraph(),
      });

      await db.insert(writingOverviewSchema).values({
        studentId: student.id,
        overview: faker.lorem.paragraph(),
      });

      // Generate data tracker entries
      const trackerDate = new Date();

      // Maths trackers
      await db.insert(mathsDataTrackerSchema).values([
        { studentId: student.id, metricName: 'Number Skills', metricValue: randomScore(), recordedAt: trackerDate },
        { studentId: student.id, metricName: 'Problem Solving', metricValue: randomScore(), recordedAt: trackerDate },
        { studentId: student.id, metricName: 'Geometry', metricValue: randomScore(), recordedAt: trackerDate },
      ]);

      // Reading trackers
      await db.insert(readingDataTrackerSchema).values([
        { studentId: student.id, metricName: 'Comprehension', metricValue: randomScore(), recordedAt: trackerDate },
        { studentId: student.id, metricName: 'Fluency', metricValue: randomScore(), recordedAt: trackerDate },
        { studentId: student.id, metricName: 'Vocabulary', metricValue: randomScore(), recordedAt: trackerDate },
      ]);

      // RWI Phonics trackers
      await db.insert(rwiPhonicsDataTrackerSchema).values([
        { studentId: student.id, metricName: 'Sound Recognition', metricValue: randomScore(), recordedAt: trackerDate },
        { studentId: student.id, metricName: 'Blending', metricValue: randomScore(), recordedAt: trackerDate },
      ]);

      // Writing trackers
      await db.insert(writingDataTrackerSchema).values([
        { studentId: student.id, metricName: 'Grammar', metricValue: randomScore(), recordedAt: trackerDate },
        { studentId: student.id, metricName: 'Spelling', metricValue: randomScore(), recordedAt: trackerDate },
        { studentId: student.id, metricName: 'Composition', metricValue: randomScore(), recordedAt: trackerDate },
      ]);
    }

    // Generate communication logs for each student
    for (const student of students) {
      // Generate 3-5 communication logs per student
      const numLogs = faker.number.int({ min: 3, max: 5 });
      const communicationTypes = ['Email', 'Phone Call', 'Meeting', 'Letter', 'Parent Conference'];

      const logs = Array.from({ length: numLogs }, () => ({
        studentId: student.id,
        date: randomDate(new Date('2024-09-03'), new Date('2025-07-23')), // Within academic year
        communicationType: faker.helpers.arrayElement(communicationTypes),
        notes: faker.lorem.paragraph(),
      }));

      await db.insert(communicationLogSchema).values(logs);
    }

    console.log('Database seed completed.');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error; // Re-throw to be caught by the main error handler
  }
}

// Enhance the main error handling
seed()
  .then(() => {
    console.log('Seeding successful!');
    pool.end().then(() => {
      console.log('Database connection closed');
      process.exit(0);
    });
  })
  .catch((error) => {
    console.error('Error seeding the database:', error);
    pool.end().then(() => {
      console.log('Database connection closed');
      process.exit(1);
    });
  });
