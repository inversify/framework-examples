import { Body, Controller, Get, Params, Post } from '@inversifyjs/http-core';
import {
  SsePublisher,
  SsePublisherOptions,
  SseStream,
} from '@inversifyjs/http-sse';
import { inject } from 'inversify';

import { ChannelService } from '../services/ChannelService.js';
import { ChatMessage } from '../types/ChatMessage.js';

@Controller('/channels')
export class ChannelController {
  constructor(
    @inject(ChannelService) private readonly channelService: ChannelService,
  ) {}

  @Get('/:channelId/messages')
  public async subscribe(
    @Params({ name: 'channelId' }) channelId: string,
    @SsePublisher()
    publisher: (options: SsePublisherOptions) => Promise<Response>,
  ): Promise<Response> {
    const stream: SseStream = this.channelService.subscribe(channelId);

    return publisher({ events: stream });
  }

  @Post('/:channelId/messages')
  public async publish(
    @Params({ name: 'channelId' }) channelId: string,
    @Body() body: ChatMessage,
  ): Promise<void> {
    await this.channelService.publish(channelId, body);
  }
}
