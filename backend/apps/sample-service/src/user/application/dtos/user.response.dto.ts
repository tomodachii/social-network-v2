import { ApiProperty } from '@nestjs/swagger';
import { ResponseBase } from '@lib/common/api';

export class UserResponseDto extends ResponseBase {
  @ApiProperty({
    example: 'joh-doe@gmail.com',
    description: "UserEntity's email address",
  })
  email: string;

  @ApiProperty({
    example: 'France',
    description: "UserEntity's country of residence",
  })
  country: string;

  @ApiProperty({
    example: '123456',
    description: 'Postal code',
  })
  postalCode: string;

  @ApiProperty({
    example: 'Park Avenue',
    description: 'Street where the user is registered',
  })
  street: string;
}
