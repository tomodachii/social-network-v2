import { IsUUID } from 'class-validator';

export class DeleteCommentDto {
  postId: string;

  commentId: string;

  @IsUUID()
  replyTo: string;
}
