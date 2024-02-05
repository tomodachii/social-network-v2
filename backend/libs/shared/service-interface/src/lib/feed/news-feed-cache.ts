import { AggregateID } from '@lib/shared/ddd-v2';

export interface NewsFeedCache {
  getUserFeed(userId: AggregateID): Promise<AggregateID[]>;
  appendNewFeed(userId: AggregateID, postId: AggregateID): Promise<void>;
}
