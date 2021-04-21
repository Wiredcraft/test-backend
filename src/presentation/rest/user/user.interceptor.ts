import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeoPosition } from '../../../domain/address.type';
import { User } from '../../../domain/user/user.types';

function transformGeoPositionToAddress(address: GeoPosition): number[] {
  if (
    address &&
    address.coordinates &&
    Array.isArray(address.coordinates) &&
    address.coordinates.length > 1
  ) {
    return [address.coordinates[1], address.coordinates[0]];
  }
  return undefined;
}

function mapUserAddressToOutside(user: User) {
  if (user && user.address) {
    return {
      ...user,
      address: transformGeoPositionToAddress(user.address),
    };
  }
  return user;
}

@Injectable()
export class UserAddressResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && Array.isArray(data)) {
          return data.map(mapUserAddressToOutside);
        }
        if (data) {
          return mapUserAddressToOutside(data);
        }
        return data;
      }),
    );
  }
}
