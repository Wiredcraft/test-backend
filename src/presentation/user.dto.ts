/**
 * @fileoverview In the context of NestJS, DTO is a class represents the value given to Controller.
 * Each property need to be decorated with class-validator decorators, to validate user input.
 *
 * @see {@link https://docs.nestjs.com/techniques/validation}
 */

import { UserId } from 'src/domain/user.interface';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'Name of User',
    example: 'John Smith',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Date of birth',
    example: '2001-03-19T08:32:13.404Z',
  })
  @IsString()
  dob: Date;

  @ApiProperty({
    description: 'Address of user',
    example: '上海市静安区',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Self-description from user',
    example: 'Cat lover from 7 years old :)',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The date to join the service',
    example: '2021-03-19T08:32:13.404Z',
  })
  @IsString()
  createdAt: Date;
}

export class UserWithIdDto extends UserDto {
  @ApiProperty({
    description: 'ID of User',
  })
  @IsNotEmpty()
  @IsString()
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
  from?: UserId;

  @ApiProperty({
    required: false,
    description: 'Maximum length of the result',
  })
  @IsNumberString()
  @IsOptional()
  limit?: string;
}
