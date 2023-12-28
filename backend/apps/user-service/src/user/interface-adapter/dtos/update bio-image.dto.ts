// Generate UpdateAvatarDto class using class-validator
// id : uuid
// type: BioImageType;
// extension: string;
// size: number;

import { BioImageType } from '@lib/user/domain';
import { IsNumber, IsString, IsUUID } from 'class-validator';
export class UpdateBioImageDto {
  @IsUUID()
  id: string;

  type: BioImageType;

  @IsString()
  extension: string;

  @IsNumber()
  size: number;
}
