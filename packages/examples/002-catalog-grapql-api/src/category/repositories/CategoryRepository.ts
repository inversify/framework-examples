import { inject, injectable } from 'inversify';
import { v7 } from 'uuid';

import {
  type Category,
  type Prisma,
  PrismaClient,
} from '../../../generated/index.js';

@injectable()
export class CategoryRepository {
  readonly #client: PrismaClient;

  constructor(
    @inject(PrismaClient)
    client: PrismaClient,
  ) {
    this.#client = client;
  }

  public async count(): Promise<number> {
    return this.#client.category.count();
  }

  public async createOne(name: string, slug: string): Promise<Category> {
    return this.#client.category.create({
      data: {
        id: v7(),
        name,
        slug,
      },
    });
  }

  public async findOneById(id: string): Promise<Category | undefined> {
    return (
      (await this.#client.category.findUnique({
        where: { id },
      })) ?? undefined
    );
  }

  public async findPaginatedAll(
    first: number,
    after?: string,
  ): Promise<Category[]> {
    const findManyArgs: Prisma.SelectSubset<
      Prisma.CategoryFindManyArgs,
      Prisma.CategoryFindManyArgs
    > = {
      take: first,
    };

    if (after !== undefined) {
      findManyArgs.cursor = { id: after };
      findManyArgs.skip = 1;
    }

    return this.#client.category.findMany(findManyArgs);
  }
}
