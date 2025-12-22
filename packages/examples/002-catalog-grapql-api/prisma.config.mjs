import path from 'node:path';

import 'dotenv/config';

import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: env('DATABASE_CONNECTION_STRING'),
    shadowDatabaseUrl: env('SHADOW_DATABASE_CONNECTION_STRING'),
  },
  schema: path.join('prisma', 'schema.prisma'),
});
