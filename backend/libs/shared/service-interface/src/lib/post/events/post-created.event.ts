import { AggregateID } from '@lib/shared/ddd-v2';

export interface PostCreatedEvent {
  id: string;
  originalPostId?: AggregateID;
  content: string;
  userId: string;
}
