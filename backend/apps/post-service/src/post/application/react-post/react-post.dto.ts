import { IsBoolean, IsEnum } from 'class-validator';
import { ReactType } from '../../domain';

export class ReactPostDto {
  postId: string;

  @IsEnum(ReactType)
  type: ReactType;

  @IsBoolean()
  isUnReact: boolean;
}
