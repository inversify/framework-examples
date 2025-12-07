import 'reflect-metadata';

import { serve } from '@hono/node-server';
import { InversifyHonoHttpAdapter } from '@inversifyjs/http-hono';
import { Hono } from 'hono';
import { Container } from 'inversify';

import { ChannelController } from './controllers/ChannelController.js';
import { ChannelService } from './services/ChannelService.js';

export async function main(): Promise<void> {
  const container: Container = new Container();

  // Bind services
  container.bind(ChannelService).toSelf().inSingletonScope();
  container.bind(ChannelController).toSelf();

  // Pass container directly as first argument
  const adapter: InversifyHonoHttpAdapter = new InversifyHonoHttpAdapter(
    container,
  );

  const app: Hono = await adapter.build();

  console.log('Server started on http://localhost:3000');

  serve({
    fetch: app.fetch,
    port: 3000,
  });
}

await main();
