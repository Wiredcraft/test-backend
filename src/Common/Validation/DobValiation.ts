import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as moment from 'moment';

@ValidatorConstraint({
  name: 'Bon',
  async: false,
})
export default class DobValiation implements ValidatorConstraintInterface {
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'error bob, must be MM-DD-YYYY';
  }

  validate(value: string, validationArguments?: ValidationArguments): boolean {
    const dob = moment(value, 'MM-DD-YYYY');
    return dob.isValid();
  }
}
