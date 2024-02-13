import { IsUUID } from 'class-validator';

export class UnfollowDto {
  @IsUUID()
  followeeId: string;
}
