import { Controller, Delete, Param, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result, match } from 'oxide.ts';
import { BaseResponse } from '@lib/shared/common/api';
import { DeleteCommentDto } from './delete-comment.dto';

@Controller('posts')
export class DeleteCommentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete(':postId/comments/:commentId')
  async create(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() body: DeleteCommentDto
  ) {
    body.postId = postId;
    body.commentId = commentId;
    const result: Result<boolean, Error> = await this.commandBus.execute(body);
    return match(result, {
      Ok: (response: boolean) => new BaseResponse<boolean>(response),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
