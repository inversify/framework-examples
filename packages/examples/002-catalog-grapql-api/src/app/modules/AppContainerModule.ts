import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';

import { AppResolvers } from '../resolvers/AppResolvers.js';
import { MutationResolvers } from '../resolvers/MutationResolvers.js';
import { QueryResolvers } from '../resolvers/QueryResolvers.js';

export class AppContainerModule extends ContainerModule {
  constructor() {
    super((options: ContainerModuleLoadOptions): void => {
      options.bind(AppResolvers).toSelf().inSingletonScope();
      options.bind(MutationResolvers).toSelf().inSingletonScope();
      options.bind(QueryResolvers).toSelf().inSingletonScope();
    });
  }
}
