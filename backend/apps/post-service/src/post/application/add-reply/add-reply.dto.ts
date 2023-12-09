import { IsEnum, IsNumber, IsString } from 'class-validator';
import { AttachmentType } from '../../domain';
import { Type } from 'class-transformer';

class AttachmentDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  size: number;

  @IsEnum(AttachmentType)
  type: AttachmentType;

  @IsString()
  description: string;
}

export class AddReplyDto {
  commentId: string;

  postId: string;

  @IsString()
  content: string;

  @Type(() => AttachmentDto)
  attachments: AttachmentDto[];
}
