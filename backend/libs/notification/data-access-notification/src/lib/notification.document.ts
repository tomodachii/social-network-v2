import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NotificationType } from '@lib/notification/domain';
import { ObjectLiteral } from '@lib/shared/common/types';

@Schema({
  timestamps: true,
  collection: 'notification',
  versionKey: 'version',
})
export class NotificationDocument {
  @Prop({ type: String, required: true })
  id!: string;

  @Prop({ type: String, required: true })
  userReceivedId!: string;

  @Prop({ type: String, required: true })
  userCreatedId!: string;

  @Prop({ type: String, enum: NotificationType, required: true })
  type!: NotificationType;

  @Prop({ type: Object })
  data!: ObjectLiteral;

  @Prop({ type: Boolean, default: false })
  isRead!: boolean;

  @Prop({ type: Date })
  createdAt!: Date;

  @Prop({ type: Date })
  updatedAt!: Date;

  @Prop({ type: Number })
  version!: number;
}

export const NotificationSchema =
  SchemaFactory.createForClass(NotificationDocument);
