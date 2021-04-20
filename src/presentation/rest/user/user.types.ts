import { ApiProperty } from '@nestjs/swagger';
import { GeoPosition } from '../../../domain/address.type';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  dateOfBirth?: Date;

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
  description?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
