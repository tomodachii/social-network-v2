import { IsUUID } from 'class-validator';

export class UnblockDto {
  @IsUUID()
  userBlockId: string;
}
