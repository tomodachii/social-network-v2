import { Logger, Module, Provider } from '@nestjs/common';
import { KafkaPostConsumer } from './kafka-post.consumer';
import {
  NewsFeedCacheModule,
  RedisNewsFeedCache,
} from '@lib/feed/news-feed-cache';
import { NEWS_FEED_CACHE } from './news-feed.di-token';

const infra: Provider[] = [
  {
    provide: NEWS_FEED_CACHE,
    useClass: RedisNewsFeedCache,
  },
];

@Module({
  imports: [NewsFeedCacheModule],
  controllers: [KafkaPostConsumer],
  providers: [...infra, Logger],
})
export class AppModule {}
