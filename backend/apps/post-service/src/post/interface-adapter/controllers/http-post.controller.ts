import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Result, match } from 'oxide.ts';
import { BaseResponse } from '@lib/shared/common/api';
import { CreatePostDto, UpdatePostDto } from '../dtos';
import {
  CreatePostCommand,
  DeletePostCommand,
  UpdatePostCommand,
  ViewPostQuery,
} from '@lib/post/feature';
import { ObjectLiteral } from '@lib/shared/common/types';

@Controller('posts/v1')
export class HttpPostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Get(':postId')
  async getPostById(@Param('postId') postId: string) {
    const result: ObjectLiteral = await this.queryBus.execute(
      new ViewPostQuery(postId)
    );
    return new BaseResponse<ObjectLiteral>(result);
  }

  @Post()
  async createPost(@Body() body: CreatePostDto) {
    const result: Result<string, Error> = await this.commandBus.execute(
      new CreatePostCommand({
        content: body.content,
        mode: body.mode,
        originalPostId: body.originalPostId,
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

  @Put(':postId')
  async updatePost(
    @Param('postId') postId: string,
    @Body() body: UpdatePostDto
  ) {
    const result: Result<boolean, Error> = await this.commandBus.execute(
      new UpdatePostCommand({
        postId: postId,
        content: body.content,
        mode: body.mode,
        attachments: body.attachments,
      })
    );
    return match(result, {
      Ok: (response: boolean) => new BaseResponse<boolean>(response),
      Err: (error: Error) => {
        throw error;
      },
    });
  }

  @Delete(':postId')
  async deletePost(@Param('postId') postId: string) {
    const result: Result<boolean, Error> = await this.commandBus.execute(
      new DeletePostCommand(postId)
    );
    return match(result, {
      Ok: (response: boolean) => new BaseResponse<boolean>(response),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
