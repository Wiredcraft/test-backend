import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate, IsDateString,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'username',
    required: true,
    example: 'test user',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  name: string;

  @ApiProperty({
    description: 'date of birth',
    required: true,
    example: '2021-03-23T11:31:49.967Z',
  })
  @IsDateString()
  dob: Date;

  @ApiProperty({
    description: 'user address',
    required: true,
    example: 'test address',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'user description',
    required: true,
    example: 'test description',
  })
  @IsString()
  description: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'username',
    example: 'test user',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  name: string;

  @ApiProperty({
    description: 'date of birth',
    example: '2021-03-23T11:31:49.967Z',
  })
  @IsDateString()
  dob: Date;

  @ApiProperty({
    description: 'user address',
    example: 'test address',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'user description',
    example: 'test description',
  })
  @IsString()
  description: string;
}

export class UpdateUserGeoInfoDto {
  // latitude range [-90:+90]
  @ApiProperty({
    description: 'user latitude',
    required: true,
    type: Number,
    minimum: -90,
    maximum: 90,
    example: 1,
  })
  @Max(90)
  @Min(-90)
  latitude: number;

  // longitude range [-180:+180]
  @ApiProperty({
    description: 'user longitude',
    required: true,
    type: Number,
    minimum: -180,
    maximum: 180,
    example: 1,
  })
  @Max(180)
  @Min(-180)
  @IsNumber()
  longitude: number;
}
