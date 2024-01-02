import { AttachmentType } from '@lib/post/domain';
import { IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';

export class AttachmentDto {
  @IsUUID()
  id: string;

  @IsString()
  extension: string;

  @IsNumber()
  size: number;

  @IsEnum(AttachmentType)
  type: AttachmentType;

  @IsString()
  description: string;
}
