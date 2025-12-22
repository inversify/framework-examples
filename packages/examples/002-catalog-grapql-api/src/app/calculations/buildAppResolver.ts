import { IResolvers } from '@graphql-tools/utils';

import { MutationResolvers } from '../resolvers/MutationResolvers.js';
import { QueryResolvers } from '../resolvers/QueryResolvers.js';

export function buildAppResolver(
  mutationResolvers: MutationResolvers,
  queryResolvers: QueryResolvers,
): IResolvers {
  const resolvers: IResolvers = {
    categories: queryResolvers.categories.bind(queryResolvers),
    category: queryResolvers.category.bind(queryResolvers),
    createCategory: mutationResolvers.createCategory.bind(mutationResolvers),
    product: queryResolvers.product.bind(queryResolvers),
  };

  return resolvers;
}
