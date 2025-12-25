import { type ServiceIdentifier } from 'inversify';
import { type Redis } from 'ioredis';

export const ioredisPublisherServiceIdentifier: ServiceIdentifier<Redis> =
  Symbol.for(
    '@inversifyjs/example-catalog-graphql-api/ioredisPublisherService',
  );
