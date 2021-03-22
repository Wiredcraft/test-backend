import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import DobValiation from '../../../Common/Validation/DobValiation';

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
    description: 'date of birth, like 12-25-1999, MM-DD-YYYY',
    required: true,
    example: '12-25-1999',
  })
  @Validate(DobValiation)
  dob: string;

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
    description: 'date of birth, like 12-25-1999, MM-DD-YYYY',
    example: '12-25-1999',
  })
  @Validate(DobValiation)
  dob: string;

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
