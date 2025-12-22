import { PrismaPg } from '@prisma/adapter-pg';
import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';

import { PrismaClient } from '../../../../generated/index.js';

export class PrismaModule extends ContainerModule {
  constructor() {
    super((options: ContainerModuleLoadOptions) => {
      options.bind(PrismaClient).toConstantValue(
        new PrismaClient({
          adapter: new PrismaPg({
            connectionString:
              'postgresql://postgres_user:password@localhost:5432/catalog_db?schema=public',
          }),
        }),
      );
    });
  }
}
