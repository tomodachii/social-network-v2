import { Expose } from 'class-transformer';

export class NotificationDto {
  @Expose()
  id: string;

  @Expose()
  userReceivedId: string;

  @Expose()
  userCreatedId: string;

  @Expose()
  type: string;

  @Expose()
  isRead: boolean;

  @Expose()
  data: object;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<NotificationDto>) {
    Object.assign(this, partial);
  }
}
