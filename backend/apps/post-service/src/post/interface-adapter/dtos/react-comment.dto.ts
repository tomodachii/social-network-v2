import { ReactType } from '@lib/post/domain';
import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';

export class ReactCommentDto {
  @IsUUID()
  @IsOptional()
  replyTo: string;

  @IsEnum(ReactType)
  type: ReactType;

  @IsBoolean()
  isUnReact: boolean;
}
