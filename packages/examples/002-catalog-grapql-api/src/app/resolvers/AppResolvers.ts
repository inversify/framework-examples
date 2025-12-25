import { inject, injectable } from 'inversify';

import { CategoryResolvers } from '../../category/resolvers/CategoryResolvers.js';
import { type Context } from '../../graphql/models/Context.js';
import type * as graphqlModels from '../../graphql/models/types.js';
import { MutationResolvers } from './MutationResolvers.js';
import { QueryResolvers } from './QueryResolvers.js';
import { SubscriptionResolvers } from './SubscriptionResolvers.js';

@injectable()
export class AppResolvers implements Partial<graphqlModels.Resolvers<Context>> {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public readonly Category: graphqlModels.CategoryResolvers<Context>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public readonly Mutation: graphqlModels.MutationResolvers<Context>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public readonly Query: graphqlModels.QueryResolvers<Context>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public readonly Subscription: graphqlModels.SubscriptionResolvers<Context>;

  constructor(
    @inject(CategoryResolvers)
    categoryResolvers: CategoryResolvers,
    @inject(MutationResolvers)
    mutationResolvers: MutationResolvers,
    @inject(QueryResolvers)
    queryResolvers: QueryResolvers,
    @inject(SubscriptionResolvers)
    subscriptionResolvers: SubscriptionResolvers,
  ) {
    this.Category = categoryResolvers;
    this.Mutation = mutationResolvers;
    this.Query = queryResolvers;
    this.Subscription = subscriptionResolvers;
  }
}
