export interface CommentCreatedEvent {
  id: string;
  content: string;
  postId: string;
  replyTo: string;
  userId: string;
}
