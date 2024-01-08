import {
  Body,
  Post,
  ConflictException as ConflictHttpException,
  Controller,
  Param,
  Put,
  Get,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateUserDto,
  CreateUserResponseDto,
  UpdateBioImageDto,
  UserResponseDto,
} from './dtos';
import { BaseResponse } from '@lib/shared/common/api';
import { Result, match } from 'oxide.ts';
import { UserAlreadyExistsError } from '@lib/user/domain';
import {
  CreateUserCommand,
  FindUserByIdQuery,
  UpdateAvatarCommand,
  UpdateCoverCommand,
} from '@lib/user/feature';

@Controller('users/v1')
export class HttpUserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post()
  async create(
    @Body() body: CreateUserDto
  ): Promise<BaseResponse<CreateUserResponseDto>> {
    const command = new CreateUserCommand(body);
    const result: Result<CreateUserResponseDto, UserAlreadyExistsError> =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (response: CreateUserResponseDto) =>
        new BaseResponse<CreateUserResponseDto>(response),
      Err: (error: Error) => {
        if (error instanceof UserAlreadyExistsError)
          throw new ConflictHttpException(error.message);
        throw error;
      },
    });
  }

  @Get(':userId')
  async findById(
    @Param('userId') userId: string
  ): Promise<BaseResponse<UserResponseDto>> {
    const result: Result<UserResponseDto, Error> = await this.queryBus.execute(
      new FindUserByIdQuery(userId)
    );

    return new BaseResponse<UserResponseDto>(result.unwrap());
  }

  @Put('avatar')
  async updateAvatar(
    @Body() body: UpdateBioImageDto
  ): Promise<BaseResponse<boolean>> {
    const command = new UpdateAvatarCommand({
      fileId: body.id,
      extension: body.extension,
      size: body.size,
    });

    const result: boolean = await this.commandBus.execute(command);

    return new BaseResponse<boolean>(result);
  }

  @Put('cover')
  async updateCover(
    @Body() body: UpdateBioImageDto
  ): Promise<BaseResponse<boolean>> {
    const command = new UpdateCoverCommand({
      fileId: body.id,
      extension: body.extension,
      size: body.size,
    });

    const result: boolean = await this.commandBus.execute(command);

    return new BaseResponse<boolean>(result);
  }
}
