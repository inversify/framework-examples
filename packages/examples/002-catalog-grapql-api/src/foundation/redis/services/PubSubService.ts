import { inject, injectable } from 'inversify';
import { type Redis } from 'ioredis';

import { ioredisPublisherServiceIdentifier } from '../models/ioredisPublisherServiceIdentifier.js';
import { ioredisSubscriberServiceIdentifier } from '../models/ioredisSubscriberServiceIdentifier.js';

@injectable()
export class PubSubService {
  readonly #publisher: Redis;
  readonly #subscriber: Redis;

  constructor(
    @inject(ioredisPublisherServiceIdentifier)
    publisher: Redis,
    @inject(ioredisSubscriberServiceIdentifier)
    subscriber: Redis,
  ) {
    this.#publisher = publisher;
    this.#subscriber = subscriber;
  }

  public async publish(channel: string, message: unknown): Promise<void> {
    await this.#publisher.publish(channel, JSON.stringify(message));
  }

  public async *subscribe<T>(channel: string): AsyncGenerator<T> {
    await this.#subscriber.subscribe(channel);

    try {
      for await (const [
        receivedChannel,
        message,
      ] of this.#createMessageIterator()) {
        if (receivedChannel === channel) {
          yield JSON.parse(message) as T;
        }
      }
    } finally {
      await this.#subscriber.unsubscribe(channel);
    }
  }

  async *#createMessageIterator(): AsyncGenerator<[string, string]> {
    const messageQueue: Array<[string, string]> = [];
    let resolveNext:
      | ((value: IteratorResult<[string, string]>) => void)
      | null = null;

    const messageHandler: (channel: string, message: string) => void = (
      channel: string,
      message: string,
    ): void => {
      const item: [string, string] = [channel, message];
      if (resolveNext !== null) {
        resolveNext({ done: false, value: item });
        resolveNext = null;
      } else {
        messageQueue.push(item);
      }
    };

    this.#subscriber.on('message', messageHandler);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      while (true) {
        if (messageQueue.length > 0) {
          const item: [string, string] | undefined = messageQueue.shift();
          if (item !== undefined) {
            yield item;
          }
        } else {
          await new Promise<IteratorResult<[string, string]>>(
            (resolve: (value: IteratorResult<[string, string]>) => void) => {
              resolveNext = resolve;
            },
          ).then((result: IteratorResult<[string, string]>): void => {
            if (result.done === false) {
              messageQueue.push(result.value);
            }
          });
        }
      }
    } finally {
      this.#subscriber.off('message', messageHandler);
    }
  }
}
