import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';

import { PrismaClient } from '../../../../generated/index.js';

export class PrismaModule extends ContainerModule {
  constructor() {
    super((options: ContainerModuleLoadOptions) => {
      options.bind(PrismaClient).toConstantValue(new PrismaClient());
    });
  }
}
