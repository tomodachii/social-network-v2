import { ReactType } from '@lib/post/domain';
import { IsBoolean, IsEnum } from 'class-validator';

export class ReactPostDto {
  @IsEnum(ReactType)
  type: ReactType;

  @IsBoolean()
  isUnReact: boolean;
}
