import {
  AddFriendCommand,
  BlockCommand,
  FollowCommand,
  UnblockCommand,
  UnfollowCommand,
  UnfriendCommand,
} from '@lib/relationship/feature';
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  AddFriendDto,
  BlockDto,
  FollowDto,
  UnblockDto,
  UnfollowDto,
  UnfriendDto,
} from './dtos';

@Controller('relationship/v1')
export class RelationshipController {
  constructor(protected readonly commandBus: CommandBus) {}

  @Post('follow')
  async follow(@Body() followDto: FollowDto) {
    return this.commandBus.execute(new FollowCommand(followDto));
  }

  @Post('unfollow')
  async unfollow(@Body() unfollow: UnfollowDto) {
    return this.commandBus.execute(new UnfollowCommand(unfollow));
  }

  @Post('add-friend')
  async addFriend(@Body() addFriend: AddFriendDto) {
    return this.commandBus.execute(new AddFriendCommand(addFriend));
  }

  @Post('unfriend')
  async unfriend(@Body() unfriendDto: UnfriendDto) {
    return this.commandBus.execute(new UnfriendCommand(unfriendDto));
  }

  @Post('block')
  async block(@Body() blockDto: BlockDto) {
    return this.commandBus.execute(new BlockCommand(blockDto));
  }

  @Post('unblock')
  async unblock(@Body() unBlockDto: UnblockDto) {
    return this.commandBus.execute(new UnblockCommand(unBlockDto));
  }
}
