import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AddReplyDto } from './add-reply.dto';
import { Result, match } from 'oxide.ts';
import { BaseResponse } from '@lib/common/api';

@Controller('posts')
export class AddReplyController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':postId/comments/:commentId/replies')
  async addReply(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() body: AddReplyDto
  ) {
    body.postId = postId;
    body.commentId = commentId;
    const result: Result<string, Error> = await this.commandBus.execute(body);
    return match(result, {
      Ok: (response: string) => new BaseResponse<string>(response),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
