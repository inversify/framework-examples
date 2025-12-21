import { inject, injectable } from 'inversify';

import { PrismaClient, type Product } from '../../../generated/index.js';

@injectable()
export class ProductRepository {
  readonly #client: PrismaClient;

  constructor(
    @inject(PrismaClient)
    client: PrismaClient,
  ) {
    this.#client = client;
  }

  public async findOneById(id: string): Promise<Product | undefined> {
    return (
      (await this.#client.product.findUnique({
        where: { id },
      })) ?? undefined
    );
  }
}
