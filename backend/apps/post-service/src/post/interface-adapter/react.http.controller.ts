import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result, match } from 'oxide.ts';
import { BaseResponse } from '@lib/shared/common/api';
import { ReactPostDto } from './dtos/react-post.dto';
import { ReactPostCommand } from '@lib/post/feature';

@Controller('posts/:postId/reacts')
export class ReactHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('')
  async create(@Param('postId') postId: string, @Body() body: ReactPostDto) {
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
}
