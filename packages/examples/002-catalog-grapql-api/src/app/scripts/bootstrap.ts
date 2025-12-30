import type http from 'node:http';

import { type ExpressContextFunctionArgument } from '@as-integrations/express5';
import {
  type InversifyApolloProvider,
  inversifyApolloProviderServiceIdentifier,
} from '@inversifyjs/apollo-core';
import { ApolloExpressServerContainerModule } from '@inversifyjs/apollo-express';
import { ApolloSubscriptionServerContainerModule } from '@inversifyjs/apollo-subscription-ws';
import { readSchemas } from '@inversifyjs/graphql-codegen';
import { InversifyExpressHttpAdapter } from '@inversifyjs/http-express';
import { Container } from 'inversify';

import { CategoryContainerModule } from '../../category/modules/CategoryContainerModule.js';
import { PrismaModule } from '../../foundation/db/modules/PrismaModule.js';
import { IoredisContainerModule } from '../../foundation/redis/modules/IoredisContainerModule.js';
import { type Context } from '../../graphql/models/Context.js';
import { ProductContainerModule } from '../../product/modules/ProductContainerModule.js';
import { AppContainerModule } from '../modules/AppContainerModule.js';
import { AppResolvers } from '../resolvers/AppResolvers.js';

const PORT: number = 3000;

const container: Container = new Container();

await container.load(
  new AppContainerModule(),
  ApolloExpressServerContainerModule.graphServerFromOptions<Context>(
    {
      controllerOptions: {
        path: '',
      },
      getContext: async (
        arg: ExpressContextFunctionArgument,
      ): Promise<Context> => ({
        request: arg.req,
      }),
    },
    {
      resolverServiceIdentifier: AppResolvers,
      typeDefs: await readSchemas({
        glob: {
          patterns: ['./graphql/schemas/**/*.graphql'],
        },
      }),
    },
  ),
  new ApolloSubscriptionServerContainerModule({
    path: '/subscriptions',
  }),
  new CategoryContainerModule(),
  new IoredisContainerModule(),
  new PrismaModule(),
  new ProductContainerModule(),
);

const adapter: InversifyExpressHttpAdapter = new InversifyExpressHttpAdapter(
  container,
);

await adapter.build();

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const inversifyApolloProvider: InversifyApolloProvider<http.Server> =
  await container.getAsync(inversifyApolloProviderServiceIdentifier);

await new Promise<void>((resolve: () => void) => {
  inversifyApolloProvider.server.listen(PORT, () => {
    resolve();
  });
});

console.log(`Server is running on http://localhost:${PORT.toString()}`);
