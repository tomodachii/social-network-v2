import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result, match } from 'oxide.ts';
import { BaseResponse } from '@lib/shared/common/api';
import { ReactCommentDto, ReactPostDto } from './dtos';
import { ReactCommentCommand, ReactPostCommand } from '@lib/post/feature';

@Controller('posts/:postId/reacts')
export class HttpReactController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('')
  async reactPost(@Param('postId') postId: string, @Body() body: ReactPostDto) {
    const result: Result<boolean, Error> = await this.commandBus.execute(
      new ReactPostCommand({
        postId,
        type: body.type,
        isUnReact: body.isUnReact,
      })
    );
    return match(result, {
      Ok: (response: boolean) => new BaseResponse<boolean>(response),
      Err: (error: Error) => {
        throw error;
      },
    });
  }

  @Post(':commentId')
  async reactComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() body: ReactCommentDto
  ) {
    const result: Result<boolean, Error> = await this.commandBus.execute(
      new ReactCommentCommand({
        commentId: commentId,
        replyTo: body.replyTo,
        postId,
        type: body.type,
        isUnReact: body.isUnReact,
      })
    );
    return match(result, {
      Ok: (response: boolean) => new BaseResponse<boolean>(response),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
