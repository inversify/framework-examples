import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';

import { CategoryRepository } from '../repositories/CategoryRepository.js';
import { CategoryResolvers } from '../resolvers/CategoryResolvers.js';

export class CategoryContainerModule extends ContainerModule {
  constructor() {
    super((options: ContainerModuleLoadOptions): void => {
      options.bind(CategoryRepository).toSelf().inSingletonScope();
      options.bind(CategoryResolvers).toSelf().inSingletonScope();
    });
  }
}
