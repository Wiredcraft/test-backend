import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Types } from 'mongoose';
const { ObjectId } = Types;

@ValidatorConstraint({
  name: 'ObjectId',
  async: false,
})
export default class ObjectIdValidation
  implements ValidatorConstraintInterface {
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'error objectID';
  }

  validate(value: string, validationArguments?: ValidationArguments): boolean {
    return ObjectId.isValid(value);
  }
}
