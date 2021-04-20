import { ApiProperty } from '@nestjs/swagger';
import { GeoPosition } from '../../../domain/address.type';
import { PartialType } from '@nestjs/mapped-types';
import {IsArray, IsDate, IsDateString, IsOptional, IsString} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'number',
    },
    description:
      'Address is represented as a coordinate based on srid-4326 lat/lon. The given example is Shanghai.',
    example: [31.225133, 121.465505],
  })
  address?: number[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'number',
    },
    description:
      'Address is represented as a coordinate based on srid-4326 lat/lon. The given example is Shanghai.',
    example: [31.225133, 121.465505],
  })
  address?: number[];

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;
}
