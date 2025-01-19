import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function resetDatabase() {
  const client = await pool.connect();
  try {
    console.log('Resetting database...');
    await client.query('DROP SCHEMA public CASCADE;');
    await client.query('CREATE SCHEMA public;');
    await client.query('GRANT ALL ON SCHEMA public TO postgres;');
    await client.query('GRANT ALL ON SCHEMA public TO public;');
    console.log('Database schema reset complete.');
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

resetDatabase();
