import { IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { AttachmentDto } from './attachment.dto';

export class UpdateCommentDto {
  @IsUUID()
  replyTo: string;

  @IsString()
  content: string;

  @Type(() => AttachmentDto)
  attachments: AttachmentDto[];
}
