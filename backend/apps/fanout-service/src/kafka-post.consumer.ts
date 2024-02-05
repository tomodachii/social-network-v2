import {
  NewsFeedCache,
  PostCreatedEvent,
  PostPattern,
} from '@lib/shared/service-interface';
import { Controller, Inject, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { NEWS_FEED_CACHE } from './news-feed.di-token';

@Controller()
export class KafkaPostConsumer {
  constructor(
    private readonly logger: Logger,
    @Inject(NEWS_FEED_CACHE) private cacheService: NewsFeedCache
  ) {}

  @EventPattern(PostPattern.PostCreated)
  async handlePostCreatedEvent(data: PostCreatedEvent) {
    await this.cacheService.appendNewFeed(data.userId, data.id);

    this.logger.log(
      `Post created event received: ${JSON.stringify(data)}`,
      'notification-service'
    );
  }
}
