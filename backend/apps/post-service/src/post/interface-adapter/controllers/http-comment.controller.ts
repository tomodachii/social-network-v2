import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result, match } from 'oxide.ts';
import { BaseResponse } from '@lib/shared/common/api';
import { CreateCommentDto, DeleteCommentDto, UpdateCommentDto } from '../dtos';
import {
  CreateCommentCommand,
  DeleteCommentCommand,
  UpdateCommentCommand,
} from '@lib/post/feature';

@Controller('posts/v1/:postId/comments')
export class HttpCommentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async addComment(
    @Param('postId') postId: string,
    @Body() body: CreateCommentDto
  ) {
    const result: Result<string, Error> = await this.commandBus.execute(
      new CreateCommentCommand({
        postId: postId,
        replyTo: body.replyTo,
        content: body.content,
        attachments: body.attachments,
      })
    );
    return match(result, {
      Ok: (response: string) => new BaseResponse<string>(response),
      Err: (error: Error) => {
        throw error;
      },
    });
  }

  @Put(':commentId')
  async updateComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() body: UpdateCommentDto
  ) {
    const result: Result<string, Error> = await this.commandBus.execute(
      new UpdateCommentCommand({
        commentId: commentId,
        postId: postId,
        replyTo: body.replyTo,
        content: body.content,
        attachments: body.attachments,
      })
    );
    return match(result, {
      Ok: (response: string) => new BaseResponse<string>(response),
      Err: (error: Error) => {
        throw error;
      },
    });
  }

  @Delete(':commentId')
  async create(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() body: DeleteCommentDto
  ) {
    const result: Result<boolean, Error> = await this.commandBus.execute(
      new DeleteCommentCommand({ postId, commentId, replyTo: body.replyTo })
    );
    return match(result, {
      Ok: (response: boolean) => new BaseResponse<boolean>(response),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
