import * as schema from '@/integrations/drizzle/schema';
import { env } from '@/lib/env';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

export const db = drizzle(neon(env.DATABASE_URL), { schema });