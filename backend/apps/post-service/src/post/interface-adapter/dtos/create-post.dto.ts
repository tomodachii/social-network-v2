import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AttachmentDto } from './attachment.dto';
import { PostMode } from '@lib/post/domain';

export class CreatePostDto {
  @IsString()
  content: string;

  @IsUUID()
  @IsOptional()
  originalPostId: string;

  @IsArray()
  @IsOptional()
  @Type(() => AttachmentDto)
  @ValidateNested()
  attachments: AttachmentDto[];

  @IsEnum(PostMode)
  mode: PostMode;
}
