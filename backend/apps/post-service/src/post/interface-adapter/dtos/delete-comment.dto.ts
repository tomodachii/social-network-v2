import { IsUUID } from 'class-validator';

export class DeleteCommentDto {
  @IsUUID()
  replyTo: string;
}
