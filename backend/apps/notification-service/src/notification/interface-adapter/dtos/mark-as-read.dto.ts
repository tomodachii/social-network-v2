import { IsUUID } from 'class-validator';

export class MarkAsReadDto {
  @IsUUID('all', { each: true })
  notificationIds: string[];
}
