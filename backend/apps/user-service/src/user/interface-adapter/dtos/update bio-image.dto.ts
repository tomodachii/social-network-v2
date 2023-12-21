// Generate UpdateAvatarDto class using class-validator
// id : uuid
// type: BioImageType;
// extension: string;
// size: number;

import { BioImageType } from '@lib/user/domain';
import { IsEnum, IsString, IsUUID } from 'class-validator';
export class UpdateBioImageDto {
  @IsUUID()
  id: string;

  @IsEnum(BioImageType)
  type: BioImageType;

  @IsString()
  extension: string;

  @IsString()
  size: number;
}
