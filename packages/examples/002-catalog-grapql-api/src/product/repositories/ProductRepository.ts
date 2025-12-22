import { inject, injectable } from 'inversify';
import { v7 } from 'uuid';

import {
  Prisma,
  PrismaClient,
  type Product,
} from '../../../generated/index.js';

@injectable()
export class ProductRepository {
  readonly #client: PrismaClient;

  constructor(
    @inject(PrismaClient)
    client: PrismaClient,
  ) {
    this.#client = client;
  }

  public async countByCategoryId(categoryId: string): Promise<number> {
    return this.#client.product.count({
      where: { categoryId },
    });
  }

  public async createOne(
    categoryId: string,
    title: string,
    description: string,
    currency: string,
    price: number,
  ): Promise<Product> {
    return this.#client.product.create({
      data: {
        categoryId,
        currency,
        description,
        id: v7(),
        price,
        title,
      },
    });
  }

  public async findOneById(id: string): Promise<Product | undefined> {
    return (
      (await this.#client.product.findUnique({
        where: { id },
      })) ?? undefined
    );
  }

  public async findPaginatedAllByCategoryId(
    categoryId: string,
    first: number,
    after?: string,
  ): Promise<Product[]> {
    const findManyArgs: Prisma.SelectSubset<
      Prisma.ProductFindManyArgs,
      Prisma.ProductFindManyArgs
    > = {
      take: first,
      where: { categoryId },
    };

    if (after !== undefined) {
      findManyArgs.cursor = { id: after };
      findManyArgs.skip = 1;
    }

    return this.#client.product.findMany(findManyArgs);
  }
}
