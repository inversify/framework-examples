import type http from 'node:http';

import {
  ApolloExpressServerContainerModule,
  httpServerServiceIdentifier,
} from '@inversifyjs/apollo-express';
import { readSchemas } from '@inversifyjs/graphql-codegen';
import { InversifyExpressHttpAdapter } from '@inversifyjs/http-express';
import { Container } from 'inversify';

import { CategoryContainerModule } from '../../category/modules/CategoryContainerModule.js';
import { PrismaModule } from '../../foundation/db/modules/PrismaModule.js';
import { ProductContainerModule } from '../../product/modules/ProductContainerModule.js';
import { AppContainerModule } from '../modules/AppContainerModule.js';
import { AppResolvers } from '../resolvers/AppResolvers.js';

export const PORT: number = 3000;

const container: Container = new Container();

await container.load(
  new AppContainerModule(),
  ApolloExpressServerContainerModule.forOptions(
    {
      controllerOptions: {
        path: '',
      },
      getContext: async () => ({}),
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
  new CategoryContainerModule(),
  new PrismaModule(),
  new ProductContainerModule(),
);

const adapter: InversifyExpressHttpAdapter = new InversifyExpressHttpAdapter(
  container,
);

await adapter.build();

const httpServer: http.Server = container.get(httpServerServiceIdentifier);

await new Promise<void>((resolve: () => void) => {
  httpServer.listen(PORT, () => {
    resolve();
  });
});

console.log(`Server is running on http://localhost:${PORT.toString()}`);
