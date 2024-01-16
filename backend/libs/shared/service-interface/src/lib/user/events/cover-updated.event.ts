import { AggregateID } from '@lib/shared/ddd-v2';
export interface CoverUpdatedEvent {
  userId: AggregateID;
  coverFileId: AggregateID;
  size: number;
  extension: string;
  version: number;
}
