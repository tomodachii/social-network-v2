import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NewsFeedCache } from '@lib/shared/service-interface';
import { AggregateID } from '@lib/shared/ddd-v2';

export class RedisNewsFeedCache implements NewsFeedCache {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  async getUserFeed(userId: AggregateID): Promise<AggregateID[]> {
    const userFeeds =
      (await this.cacheService.get<AggregateID[]>(userId.toString())) || [];
    return userFeeds;
  }

  async appendNewFeed(userId: AggregateID, postId: AggregateID): Promise<void> {
    const userFeeds = await this.getUserFeed(userId);
    userFeeds.unshift(postId);
    await this.cacheService.set(userId.toString(), userFeeds);
  }
}
