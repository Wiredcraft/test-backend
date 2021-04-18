import { GeoPosition } from './address.type';
import { PartialType } from '@nestjs/mapped-types';

export interface User {
  id: string;
  name: string;
  dateOfBirth?: Date;
  address?: GeoPosition;
  description?: string;
}

export class CreateUserDto {
  name: string;
  dateOfBirth: Date;
  address: GeoPosition;
  description: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
