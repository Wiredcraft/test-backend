import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { CreateUserDtoPresentation } from './user.types';
// import { CreateUserDto } from './user.types';
import { GeoPosition } from '../../../domain/address.type';
import { CreateUserDto } from '../../../domain/user/user.types';

// Transforms lat/long to long/lat for GeoPosition, used to display points in the application
function transformLatLongToGeoPosition(address: number[]): GeoPosition {
  if (address && address.length > 1) {
    return {
      type: 'Point',
      coordinates: [address[1], address[0]],
    };
  }
  return undefined;
}

export class UserDTOTransformPipe
  implements PipeTransform<CreateUserDtoPresentation, CreateUserDto> {
  transform(
    value: CreateUserDtoPresentation,
    metadata: ArgumentMetadata,
  ): CreateUserDto {
    const payload = value;
    if (
      metadata.type == 'body' &&
      payload.address != null &&
      Array.isArray(payload.address) &&
      payload.address.length > 1
    ) {
      return {
        ...payload,
        address: transformLatLongToGeoPosition(payload.address),
      };
    }
    return value as CreateUserDto;
  }
}
