import { type ServiceIdentifier } from 'inversify';
import { type Redis } from 'ioredis';

export const ioredisSubscriberServiceIdentifier: ServiceIdentifier<Redis> =
  Symbol.for(
    '@inversifyjs/example-catalog-graphql-api/ioredisSubscriberService',
  );
