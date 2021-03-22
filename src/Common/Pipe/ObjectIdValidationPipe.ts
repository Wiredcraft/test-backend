import { ArgumentMetadata, HttpStatus, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import BusinessError from '../BusinessError';
import { ErrorCode } from '../../ErrorCode';

const { ObjectId } = Types;

// validate mongo objectId
export default class ObjectIdValidationPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata): string {
    if (!ObjectId.isValid(value)) {
      throw new BusinessError(
        HttpStatus.BAD_REQUEST,
        ErrorCode.ParamError,
        'id must be ObjectId',
      );
    }
    return value;
  }
}
