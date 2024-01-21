import {
  NotificationCreatedEvent,
  NotificationEntity,
  NotificationGateway,
} from '@lib/notification/domain';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class WebSocketNotificationGateway implements NotificationGateway {
  @WebSocketServer()
  server: Server;

  emitNotificationEvent(data: NotificationEntity) {
    const event: NotificationCreatedEvent = {
      id: data.id,
      userReceivedId: data.userReceivedId,
      type: data.type,
      data: data.data,
    };

    this.server.emit('notification_created', event, { userId: '123' });
  }
}
