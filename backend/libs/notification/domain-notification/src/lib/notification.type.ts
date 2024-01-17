import { AggregateID } from '@lib/shared/ddd-v2';

export enum NotificationType {
  PostCreated = 'PostCreated',
  CommentCreated = 'CommentCreated',
  PostReacted = 'PostReacted',
  CommentReacted = 'CommentReacted',
  FriendRequest = 'FriendRequest',
}

export type NotificationDataMap = {
  [NotificationType.PostCreated]: PostCreatedData;
  [NotificationType.CommentCreated]: CommentCreatedData;
  [NotificationType.PostReacted]: PostReactedData;
};

export type NotificationData<T extends NotificationType> =
  T extends keyof NotificationDataMap ? NotificationDataMap[T] : never;

export type PostCreatedData = {
  id: string;
  originalPostId?: AggregateID;
  content: string;
  userId: AggregateID;
};

export type CommentCreatedData = {
  id: AggregateID;
  replyTo: AggregateID;
  content: string;
  postId: AggregateID;
  userId: AggregateID;
};

export type PostReactedData = {
  id: AggregateID;
  postId: AggregateID;
  react: string;
  userId: AggregateID;
};
