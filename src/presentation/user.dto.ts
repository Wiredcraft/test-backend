/**
 * @fileoverview In the context of NestJS, DTO is a class represents the value given to Controller.
 * Each property need to be decorated with class-validator decorators, to validate user input.
 *
 * @see {@link https://docs.nestjs.com/techniques/validation}
 */

import { UserId } from 'src/domain/user.interface';
import {
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description:
      'The non-empty user name displayed in the system, as known as display-name. Its length should be less than 50 characters (same to Twitter).',
    example: 'John Smith',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  name: string;

  @ApiProperty({
    description: "The user's date of birth. Could be null.",
    example: '2001-03-19T08:32:13.404Z',
  })
  @IsDateString()
  @IsOptional()
  dob: Date;

  @ApiProperty({
    description: "The user's address. Could be null or empty.",
    example: '上海市静安区',
  })
  @IsString()
  @IsOptional()
  @Length(0, 30)
  address: string;

  @ApiProperty({
    description: "The user's self-description. Could be null or empty.",
    example: 'Cat lover from 7 years old :)',
  })
  @IsString()
  @IsOptional()
  @Length(0, 160)
  description: string;

  /**
   * Assume that API is not disclosed to end-users.
   * So `createdAt` param is also update-able by design.
   */
  @ApiProperty({
    description: 'The date to join the service',
    example: '2021-03-19T08:32:13.404Z',
  })
  @IsDateString()
  createdAt: Date;
}

export class UserWithIdDto extends UserDto {
  @ApiProperty({
    description: 'ID of User',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 36)
  id: UserId;
}

export class ListConditionDto {
  @ApiProperty({
    required: false,
    description:
      'UserId exclusively starts from. Usually set the UserId of last element in previous result',
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @Length(1, 36)
  from?: UserId;

  @ApiProperty({
    required: false,
    description: 'Maximum length of the result',
  })
  @IsNumberString()
  @IsOptional()
  @Length(1, 100)
  limit?: string;
}
