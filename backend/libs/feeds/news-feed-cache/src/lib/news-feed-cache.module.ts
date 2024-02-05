import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { RedisNewsFeedCache } from './redis-news-feed-cache';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6380,
    }),
  ],
  providers: [RedisNewsFeedCache],
  exports: [CacheModule, RedisNewsFeedCache],
})
export class NewsFeedCacheModule {}
