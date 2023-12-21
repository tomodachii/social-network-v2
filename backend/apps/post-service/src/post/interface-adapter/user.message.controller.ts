import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class UserMessageController {
  @EventPattern('user.created')
  async handleUserCreatedEvent(data: any) {
    console.log(data);
  }
}
