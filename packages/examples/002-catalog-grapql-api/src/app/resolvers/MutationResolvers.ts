import { inject, injectable } from 'inversify';

import { type Category as CategoryDb } from '../../../generated/index.js';
import { CategoryRepository } from '../../category/repositories/CategoryRepository.js';
import { type Context } from '../../graphql/models/Context.js';
import type * as graphqlModels from '../../graphql/models/types.js';

@injectable()
export class MutationResolvers implements graphqlModels.MutationResolvers<Context> {
  readonly #categoryRepository: CategoryRepository;

  constructor(
    @inject(CategoryRepository)
    categoryRepository: CategoryRepository,
  ) {
    this.#categoryRepository = categoryRepository;
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
}
