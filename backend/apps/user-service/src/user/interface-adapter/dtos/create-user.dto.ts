import {
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';
import { Gender } from '@lib/user/domain';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsPhoneNumber()
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  @Matches(/^[a-zA-Z ]*$/)
  firstName: string;

  @IsString()
  @ApiProperty()
  @Matches(/^[a-zA-Z ]*$/)
  lastName: string;

  @IsDateString()
  @ApiProperty()
  birthDay: Date;

  @IsEnum(Gender)
  @ApiProperty()
  gender: Gender;
}
