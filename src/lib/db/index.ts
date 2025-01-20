import path from 'node:path';

import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { migrate as migratePg } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';

import * as schema from '@/models/Schema';

import { Env } from '../../libs/Env';

// Initialize DB connection
const initializeDb = async () => {
  const migrationsFolder = path.join(process.cwd(), 'migrations');

  const client = new Client({ connectionString: Env.DATABASE_URL });
  await client.connect();
  const db = drizzlePg(client, { schema });
  await migratePg(db, { migrationsFolder });
  return db;
};

export const db = await initializeDb();
