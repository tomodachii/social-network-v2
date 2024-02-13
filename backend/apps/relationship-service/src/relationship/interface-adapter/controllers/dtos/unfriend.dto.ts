import { IsUUID } from 'class-validator';

export class UnfriendDto {
  @IsUUID()
  friendId: string;
}
