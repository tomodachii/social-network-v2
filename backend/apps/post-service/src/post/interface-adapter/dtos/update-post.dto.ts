import { IsArray, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { AttachmentDto } from './attachment.dto';
import { PostMode } from '@lib/post/domain';

export class UpdatePostDto {
  @IsString()
  content: string;

  @IsArray()
  @Type(() => AttachmentDto)
  attachments: AttachmentDto[];

  @IsEnum(PostMode)
  mode: PostMode;
}
