import { inject, injectable } from 'inversify';

import { PubSubChannel } from '../../foundation/redis/models/PubSubChannels.js';
import { PubSubService } from '../../foundation/redis/services/PubSubService.js';
import { Context } from '../../graphql/models/Context.js';
import * as graphqlModels from '../../graphql/models/types.js';

@injectable()
export class SubscriptionResolvers implements graphqlModels.SubscriptionResolvers<Context> {
  public readonly productAdded: graphqlModels.SubscriptionSubscriberObject<
    graphqlModels.ResolverTypeWrapper<graphqlModels.Product>,
    'productAdded',
    unknown,
    Context,
    unknown
  >;

  readonly #pubSubService: PubSubService;

  constructor(
    @inject(PubSubService)
    pubSubService: PubSubService,
  ) {
    this.#pubSubService = pubSubService;

    const pubSubServiceRef: PubSubService = this.#pubSubService;

    this.productAdded = {
      subscribe: async function* (): AsyncGenerator<{
        productAdded: graphqlModels.ResolverTypeWrapper<graphqlModels.Product>;
      }> {
        for await (const product of pubSubServiceRef.subscribe<graphqlModels.Product>(
          PubSubChannel.productAdded,
        )) {
          yield { productAdded: product };
        }
      },
    };
  }
}
