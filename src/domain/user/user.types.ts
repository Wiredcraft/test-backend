import { GeoPosition } from './address.type';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export interface User {
  id: string;
  name: string;
  dateOfBirth?: Date;
  address?: GeoPosition;
  description?: string;
}

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  dateOfBirth?: Date;

  @ApiProperty()
  address?: GeoPosition;

  @ApiProperty()
  description?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
