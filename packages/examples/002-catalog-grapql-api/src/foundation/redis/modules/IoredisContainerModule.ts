import 'dotenv/config';

import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { Redis } from 'ioredis';

import { ioredisPublisherServiceIdentifier } from '../models/ioredisPublisherServiceIdentifier.js';
import { ioredisSubscriberServiceIdentifier } from '../models/ioredisSubscriberServiceIdentifier.js';
import { PubSubService } from '../services/PubSubService.js';

export class IoredisContainerModule extends ContainerModule {
  constructor() {
    super((options: ContainerModuleLoadOptions): void => {
      const redisConfig: { host: string; port: number } = {
        host: process.env['REDIS_HOST'] as string,
        port: parseInt(process.env['REDIS_PORT'] as string, 10),
      };

      options
        .bind(ioredisPublisherServiceIdentifier)
        .toConstantValue(new Redis(redisConfig));

      options
        .bind(ioredisSubscriberServiceIdentifier)
        .toConstantValue(new Redis(redisConfig));

      options.bind(PubSubService).toSelf().inSingletonScope();
    });
  }
}
