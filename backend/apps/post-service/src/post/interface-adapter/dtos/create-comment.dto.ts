import { IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AttachmentDto } from './attachment.dto';

export class CreateCommentDto {
  @IsUUID()
  replyTo: string;

  @IsString()
  content: string;

  @Type(() => AttachmentDto)
  @ValidateNested()
  attachments: AttachmentDto[];
}
