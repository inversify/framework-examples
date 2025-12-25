import { inject, injectable } from 'inversify';

import {
  type Category as CategoryDb,
  type Product as ProductDb,
} from '../../../generated/index.js';
import { CategoryRepository } from '../../category/repositories/CategoryRepository.js';
import { PubSubChannel } from '../../foundation/redis/models/PubSubChannels.js';
import { PubSubService } from '../../foundation/redis/services/PubSubService.js';
import { type Context } from '../../graphql/models/Context.js';
import type * as graphqlModels from '../../graphql/models/types.js';
import { ProductRepository } from '../../product/repositories/ProductRepository.js';

@injectable()
export class MutationResolvers implements graphqlModels.MutationResolvers<Context> {
  readonly #categoryRepository: CategoryRepository;
  readonly #productRepository: ProductRepository;
  readonly #pubSubService: PubSubService;

  constructor(
    @inject(CategoryRepository)
    categoryRepository: CategoryRepository,
    @inject(ProductRepository)
    productRepository: ProductRepository,
    @inject(PubSubService)
    pubSubService: PubSubService,
  ) {
    this.#categoryRepository = categoryRepository;
    this.#productRepository = productRepository;
    this.#pubSubService = pubSubService;
  }

  public async createCategory(
    _parent: unknown,
    args: graphqlModels.MutationCreateCategoryArgs,
  ): Promise<graphqlModels.Category> {
    const category: CategoryDb = await this.#categoryRepository.createOne(
      args.input.name,
      args.input.slug,
    );

    return {
      id: category.id,
      name: category.name,
      products: {
        edges: [],
        pageInfo: {
          endCursor: null,
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
        },
        totalCount: 0,
      },
      slug: category.slug,
    };
  }

  public async createProduct(
    _parent: unknown,
    args: graphqlModels.MutationCreateProductArgs,
  ): Promise<graphqlModels.Product> {
    const product: ProductDb = await this.#productRepository.createOne(
      args.input.categoryId,
      args.input.title,
      args.input.description,
      args.input.currency,
      args.input.price,
    );

    const productPayload: graphqlModels.Product = {
      currency: product.currency,
      description: product.description,
      id: product.id,
      price: product.price,
      title: product.title,
    };

    await this.#pubSubService.publish(
      PubSubChannel.productAdded,
      productPayload,
    );

    return productPayload;
  }
}
