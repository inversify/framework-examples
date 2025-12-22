import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';

import { CategoryRepository } from '../repositories/CategoryRepository.js';

export class CategoryContainerModule extends ContainerModule {
  constructor() {
    super((options: ContainerModuleLoadOptions): void => {
      options.bind(CategoryRepository).toSelf().inSingletonScope();
    });
  }
}
