import { SseStream } from '@inversifyjs/http-sse';
import { injectable } from 'inversify';

import { ChatMessage } from '../types/ChatMessage.js';

@injectable()
export class ChannelService {
  private readonly channels: Map<string, Set<SseStream>> = new Map();

  public subscribe(channelId: string): SseStream {
    if (!this.channels.has(channelId)) {
      this.channels.set(channelId, new Set());
    }
    const streams: Set<SseStream> | undefined = this.channels.get(channelId);

    if (!streams) {
      throw new Error(`Channel ${channelId} not found`);
    }

    const stream: SseStream = new SseStream();
    streams.add(stream);

    stream.on('close', () => {
      streams.delete(stream);
      if (streams.size === 0) {
        this.channels.delete(channelId);
      }
    });

    return stream;
  }

  public async publish(channelId: string, message: ChatMessage): Promise<void> {
    const streams: Set<SseStream> | undefined = this.channels.get(channelId);
    if (!streams) return;

    // Broadcast to all streams in the channel
    const promises: Promise<void>[] = Array.from(streams).map(
      async (stream: SseStream): Promise<void> =>
        stream.writeMessageEvent({
          data: JSON.stringify(message),
          type: 'message',
        }),
    );

    await Promise.all(promises);
  }
}
