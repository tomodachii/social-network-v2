import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result, match } from 'oxide.ts';
import { BaseResponse } from '@lib/shared/common/api';
import { ReactPostDto } from './react-post.dto';

@Controller('posts')
export class ReactPostController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':id/reacts')
  async create(@Param('id') id: string, @Body() body: ReactPostDto) {
    body.postId = id;
    const result: Result<boolean, Error> = await this.commandBus.execute(body);
    return match(result, {
      Ok: (response: boolean) => new BaseResponse<boolean>(response),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
