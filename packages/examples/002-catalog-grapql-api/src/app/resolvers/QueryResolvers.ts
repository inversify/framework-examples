import { inject, injectable } from 'inversify';

import {
  type Category as CategoryDb,
  type Product as ProductDb,
} from '../../../generated/index.js';
import { CategoryRepository } from '../../category/repositories/CategoryRepository.js';
import { type Context } from '../../graphql/models/Context.js';
import type * as graphqlModels from '../../graphql/models/types.js';
import { ProductRepository } from '../../product/repositories/ProductRepository.js';

const MAX_ELEMENTS_PER_PAGE: number = 20;

@injectable()
export class QueryResolvers implements graphqlModels.QueryResolvers<Context> {
  readonly #categoryRepository: CategoryRepository;
  readonly #productRepository: ProductRepository;

  constructor(
    @inject(CategoryRepository)
    categoryRepository: CategoryRepository,
    @inject(ProductRepository)
    productRepository: ProductRepository,
  ) {
    this.#categoryRepository = categoryRepository;
    this.#productRepository = productRepository;
  }

  public async categories(
    _parent: unknown,
    args: Partial<graphqlModels.QueryCategoriesArgs>,
  ): Promise<graphqlModels.CategoryConnection> {
    const firstValue: number = Math.max(
      Math.min(args.first ?? MAX_ELEMENTS_PER_PAGE, MAX_ELEMENTS_PER_PAGE),
      0,
    );

    const [categoriesDb, totalCount]: [CategoryDb[], number] =
      await Promise.all([
        this.#categoryRepository.findPaginatedAll(
          firstValue,
          args.after ?? undefined,
        ),
        this.#categoryRepository.count(),
      ]);

    const endCursor: string | null =
      categoriesDb.length > 0
        ? (categoriesDb[categoriesDb.length - 1]?.id ?? null)
        : null;

    const startCursor: string | null =
      categoriesDb.length > 0 ? (categoriesDb[0]?.id ?? null) : null;

    return {
      edges: categoriesDb.map((category: CategoryDb) => ({
        cursor: category.id,
        node: {
          id: category.id,
          name: category.name,
          slug: category.slug,
        },
      })),
      pageInfo: {
        endCursor,
        hasNextPage: categoriesDb.length === firstValue,
        hasPreviousPage: args.after != null,
        startCursor,
      },
      totalCount,
    };
  }

  public async category(
    _parent: unknown,
    args: graphqlModels.QueryCategoryArgs,
  ): Promise<Partial<graphqlModels.Category> | null> {
    const categoryDb: CategoryDb | undefined =
      await this.#categoryRepository.findOneById(args.id);

    if (categoryDb === undefined) {
      return null;
    }

    return {
      id: categoryDb.id,
      name: categoryDb.name,
      slug: categoryDb.slug,
    };
  }

  public async product(
    _parent: unknown,
    args: graphqlModels.QueryProductArgs,
  ): Promise<graphqlModels.Product | null> {
    const productDb: ProductDb | undefined =
      await this.#productRepository.findOneById(args.id);

    if (productDb === undefined) {
      return null;
    }

    return {
      currency: productDb.currency,
      description: productDb.description,
      id: productDb.id,
      price: productDb.price,
      title: productDb.title,
    };
  }
}
