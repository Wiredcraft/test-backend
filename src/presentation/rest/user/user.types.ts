import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';
import { GeoPosition } from '../../../domain/address.type';

export class CreateUserDtoPresentation {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'array',
    items: {
      type: 'number',
    },
    description:
      'Address is represented as a coordinate based on srid-4326 lat/lon. The given example is Shanghai.',
    example: [31.225133, 121.465505],
  })
  address?: GeoPosition | number[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateUserDtoPresentation extends PartialType(
  CreateUserDtoPresentation,
) {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    required: false,
    type: 'array',
    items: {
      type: 'number',
    },
    description:
      'Address is represented as a coordinate based on srid-4326 lat/lon. The given example is Shanghai.',
    example: [31.225133, 121.465505],
  })
  address?: GeoPosition | number[];

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  description?: string;
}
