import path from 'node:path';

import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { migrate as migratePg } from 'drizzle-orm/node-postgres/migrator';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { migrate as migratePglite } from 'drizzle-orm/pglite/migrator';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';
import { Client } from 'pg';

import * as schema from '@/models/Schema';

import { Env } from './Env';

// Initialize DB connection
const initializeDb = async () => {
  const migrationsFolder = path.join(process.cwd(), 'migrations');

  if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD && Env.DATABASE_URL) {
    const client = new Client({ connectionString: Env.DATABASE_URL });
    await client.connect();
    const db = drizzlePg(client, { schema });
    await migratePg(db, { migrationsFolder });
    return db;
  } else {
    const pglite = new PGlite();
    await pglite.waitReady;
    const db = drizzlePglite(pglite, { schema });
    await migratePglite(db, { migrationsFolder });
    return db;
  }
};

export const db = await initializeDb();
