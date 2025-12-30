import { inject, injectable } from 'inversify';

import { type Product as ProductDb } from '../../../generated/index.js';
import { Context } from '../../graphql/models/Context.js';
import type * as graphqlModels from '../../graphql/models/types.js';
import { ProductRepository } from '../../product/repositories/ProductRepository.js';

const MAX_ELEMENTS_PER_PAGE: number = 20;

@injectable()
export class CategoryResolvers implements graphqlModels.CategoryResolvers<Context> {
  readonly #productRepository: ProductRepository;

  constructor(
    @inject(ProductRepository)
    productRepository: ProductRepository,
  ) {
    this.#productRepository = productRepository;
  }

  public id(parent: graphqlModels.Category): string {
    return parent.id;
  }

  public name(parent: graphqlModels.Category): string {
    return parent.name;
  }

  public async products(
    parent: graphqlModels.Category,
    args: Partial<graphqlModels.CategoryProductsArgs>,
  ): Promise<graphqlModels.ProductConnection> {
    const firstValue: number = Math.max(
      Math.min(args.first ?? MAX_ELEMENTS_PER_PAGE, MAX_ELEMENTS_PER_PAGE),
      0,
    );

    const [productsDb, totalCount]: [ProductDb[], number] = await Promise.all([
      this.#productRepository.findPaginatedAllByCategoryId(
        parent.id,
        firstValue,
        args.after ?? undefined,
      ),
      this.#productRepository.countByCategoryId(parent.id),
    ]);

    const endCursor: string | null =
      productsDb.length > 0
        ? (productsDb[productsDb.length - 1]?.id ?? null)
        : null;

    const startCursor: string | null =
      productsDb.length > 0 ? (productsDb[0]?.id ?? null) : null;

    return {
      edges: productsDb.map((product: ProductDb) => ({
        cursor: product.id,
        node: {
          currency: product.currency,
          description: product.description,
          id: product.id,
          price: product.price,
          title: product.title,
        },
      })),
      pageInfo: {
        endCursor,
        hasNextPage: productsDb.length === firstValue,
        hasPreviousPage: args.after != null,
        startCursor,
      },
      totalCount,
    };
  }

  public slug(parent: graphqlModels.Category): string {
    return parent.slug;
  }
}
