import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';

import { ProductRepository } from '../repositories/ProductRepository.js';

export class ProductContainerModule extends ContainerModule {
  constructor() {
    super((options: ContainerModuleLoadOptions) => {
      options.bind(ProductRepository).toSelf().inSingletonScope();
    });
  }
}
