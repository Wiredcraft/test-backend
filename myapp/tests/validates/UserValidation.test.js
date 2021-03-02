const UserValidation = require('../../validates/UserValidation');

describe('Testing isValidDate method:', () => {
  test('2021-02-27 is a valid date.', () => {
    expect(UserValidation.isValidDate('2021-02-27')).toBe(true);
  });

  test('20210227 is not a valid date.', () => {
    expect(UserValidation.isValidDate('20210227')).toBe(false);
  });

  test('2021-0227 is not a valid date.', () => {
    expect(UserValidation.isValidDate('2021-0227')).toBe(false);
  });

  test('202102-27 is not a valid date.', () => {
    expect(UserValidation.isValidDate('2021-0227')).toBe(false);
  });

  test('ABCD-EF-GH is not a valid date.', () => {
    expect(UserValidation.isValidDate('ABCD-EF-GH')).toBe(false);
  });

  test('ABCD-02-27 is not a valid date.', () => {
    expect(UserValidation.isValidDate('ABCD-02-27')).toBe(false);
  });

  test('2021-EF-27 is not a valid date.', () => {
    expect(UserValidation.isValidDate('2021-EF-27')).toBe(false);
  });

  test('2021-02-GH is not a valid date.', () => {
    expect(UserValidation.isValidDate('2021-02-GH')).toBe(false);
  });
});

describe('Testing isPositiveInteger method:', () => {
  test('1 is a positive integer.', () => {
    expect(UserValidation.isPositiveInteger('1')).toBe(true);
  });

  test('10 is a positive integer.', () => {
    expect(UserValidation.isPositiveInteger('10')).toBe(true);
  });

  test('0 is not a positive integer.', () => {
    expect(UserValidation.isPositiveInteger('0')).toBe(false);
  });

  test('-1 is not a positive integer.', () => {
    expect(UserValidation.isPositiveInteger('-1')).toBe(false);
  });

  test('1.0 is not a positive integer.', () => {
    expect(UserValidation.isPositiveInteger('1.0')).toBe(false);
  });
});

describe('Testing areAllInputFieldsAllowed method:', () => {
  test(`name is an allowed user field.`, () => {
    const fields = {
      name: 'test1'
    };
    expect(UserValidation.areAllInputFieldsAllowed(fields)).toBe(true);
  });

  test(`All fields are allowed.`, () => {
    const fields = {
      name: 'test1',
      dob: '2021-02-27',
      address: {
        longtitude: 123.45,
        latitude: 23.45,
        description: 'Address 1'
      },
      description: 'student'
    };
    expect(UserValidation.areAllInputFieldsAllowed(fields)).toBe(true);
  });

  test(`id is not an allowed user field.`, () => {
    const fields = {
      id: 1
    };
    expect(UserValidation.areAllInputFieldsAllowed(fields)).toBe(false);
  });

  test(`id is not an allowed address field.`, () => {
    const fields = {
      address: {
        id: 1
      }
    };
    expect(UserValidation.areAllInputFieldsAllowed(fields)).toBe(false);
  });
});

describe('Testing isAnyRequiredFieldEmpty method:', () => {
  test(`Fields is an empty object.`, () => {
    const fields = {};
    expect(UserValidation.isAnyRequiredFieldEmpty(fields)).toBe(true);
  });

  test(`When some user fields are empty.`, () => {
    const fields = {
      name: 'test1',
      dob: '2021-02-28'
    };
    expect(UserValidation.isAnyRequiredFieldEmpty(fields)).toBe(true);
  });

  test(`When address field is an empty object.`, () => {
    const fields = {
      name: 'test1',
      dob: '2021-02-28',
      address: {},
      description: 'student'
    };
    expect(UserValidation.isAnyRequiredFieldEmpty(fields)).toBe(true);
  });

  test(`When some address fields are empty..`, () => {
    const fields = {
      name: 'test1',
      dob: '2021-02-28',
      address: {
        description: 'Address 1'
      },
      description: 'student'
    };
    expect(UserValidation.isAnyRequiredFieldEmpty(fields)).toBe(true);
  });

  test(`When all fields are not empty.`, () => {
    const fields = {
      name: 'test1',
      dob: '2021-02-27',
      address: {
        longtitude: '123.45',
        latitude: '34.56',
        description: 'Address 1'
      },
      description: 'student'
    };
    expect(UserValidation.isAnyRequiredFieldEmpty(fields)).toBe(false);
  });
});

describe('Testing areAllRequiredFieldsEmpty method:', () => {
  test(`Fields is an empty object.`, () => {
    const fields = {};
    expect(UserValidation.areAllRequiredFieldsEmpty(fields)).toBe(true);
  });

  test(`When some user fields are not empty.`, () => {
    const fields = {
      name: 'test1',
      dob: '2021-02-28'
    };
    expect(UserValidation.areAllRequiredFieldsEmpty(fields)).toBe(false);
  });

  test(`When address field is an empty object.`, () => {
    const fields = {
      address: {}
    };
    expect(UserValidation.areAllRequiredFieldsEmpty(fields)).toBe(true);
  });

  test(`When some address fields are empty..`, () => {
    const fields = {
      address: {
        description: 'Address 1'
      }
    };
    expect(UserValidation.areAllRequiredFieldsEmpty(fields)).toBe(false);
  });

  test(`When all fields are not empty.`, () => {
    const fields = {
      name: 'test1',
      dob: '2021-02-27',
      address: {
        longtitude: '123.45',
        latitude: '34.56',
        description: 'Address 1'
      },
      description: 'student'
    };
    expect(UserValidation.areAllRequiredFieldsEmpty(fields)).toBe(false);
  });
});

describe('Testing isValidLongtitude method:', () => {
  test('abc is an invalid longtitude.', () => {
    expect(UserValidation.isValidLongtitude('abc')).toBe(false);
  });
  test('.12 is an invalid longtitude.', () => {
    expect(UserValidation.isValidLongtitude('.12')).toBe(false);
  });
  test('12c is an invalid longtitude.', () => {
    expect(UserValidation.isValidLongtitude('12c')).toBe(false);
  });
  test('12.3c is an invalid longtitude.', () => {
    expect(UserValidation.isValidLongtitude('12.3c')).toBe(false);
  });
  test('180.1 is an invalid longtitude.', () => {
    expect(UserValidation.isValidLongtitude('180.1')).toBe(false);
  });
  test('-180.1 is an invalid longtitude.', () => {
    expect(UserValidation.isValidLongtitude('-180.1')).toBe(false);
  });
  test('-0.12345 is an invalid longtitude.', () => {
    expect(UserValidation.isValidLongtitude('-0.12345')).toBe(false);
  });
  test('0.12345 is an invalid longtitude.', () => {
    expect(UserValidation.isValidLongtitude('0.12345')).toBe(false);
  });
  test('+123 is an invalid longtitude.', () => {
    expect(UserValidation.isValidLongtitude('+123')).toBe(false);
  });
  test('180.00000 is an invalid longtitude.', () => {
    expect(UserValidation.isValidLongtitude('180.00000')).toBe(false);
  });
  test('180.0000 is a valid longtitude.', () => {
    expect(UserValidation.isValidLongtitude('180.0000')).toBe(true);
  });
  test('180 is a valid longtitude.', () => {
    expect(UserValidation.isValidLongtitude('180')).toBe(true);
  });
  test('-180 is a valid longtitude.', () => {
    expect(UserValidation.isValidLongtitude('-180')).toBe(true);
  });
  test('-34.12 is a valid longtitude.', () => {
    expect(UserValidation.isValidLongtitude('-34.12')).toBe(true);
  });
  test('34.123 is a valid longtitude.', () => {
    expect(UserValidation.isValidLongtitude('34.123')).toBe(true);
  });
  test('123.4567 is a valid longtitude.', () => {
    expect(UserValidation.isValidLongtitude('123.4567')).toBe(true);
  });
  test('-123.4567 is a valid longtitude.', () => {
    expect(UserValidation.isValidLongtitude('-123.4567')).toBe(true);
  });
});

describe('Testing isValidLatitude method:', () => {
  test('abc is an invalid latitude.', () => {
    expect(UserValidation.isValidLatitude('abc')).toBe(false);
  });
  test('.12 is an invalid latitude.', () => {
    expect(UserValidation.isValidLatitude('.12')).toBe(false);
  });
  test('12c is an invalid latitude.', () => {
    expect(UserValidation.isValidLatitude('12c')).toBe(false);
  });
  test('12.3c is an invalid latitude.', () => {
    expect(UserValidation.isValidLatitude('12.3c')).toBe(false);
  });
  test('85.1 is an invalid latitude.', () => {
    expect(UserValidation.isValidLatitude('85.1')).toBe(false);
  });
  test('-85.1 is an invalid latitude.', () => {
    expect(UserValidation.isValidLatitude('-85.1')).toBe(false);
  });
  test('-0.12345 is an invalid latitude.', () => {
    expect(UserValidation.isValidLatitude('-0.12345')).toBe(false);
  });
  test('0.12345 is an invalid latitude.', () => {
    expect(UserValidation.isValidLatitude('0.12345')).toBe(false);
  });
  test('+123 is an invalid latitude.', () => {
    expect(UserValidation.isValidLatitude('+123')).toBe(false);
  });
  test('85.00000 is an invalid latitude.', () => {
    expect(UserValidation.isValidLatitude('85.00000')).toBe(false);
  });
  test('85.0000 is a valid latitude.', () => {
    expect(UserValidation.isValidLatitude('85.0000')).toBe(true);
  });
  test('85 is a valid latitude.', () => {
    expect(UserValidation.isValidLatitude('85')).toBe(true);
  });
  test('-85 is a valid latitude.', () => {
    expect(UserValidation.isValidLatitude('-85')).toBe(true);
  });
  test('-34.12 is a valid latitude.', () => {
    expect(UserValidation.isValidLatitude('-34.12')).toBe(true);
  });
  test('34.123 is a valid latitude.', () => {
    expect(UserValidation.isValidLatitude('34.123')).toBe(true);
  });
  test('84.4567 is a valid latitude.', () => {
    expect(UserValidation.isValidLatitude('84.4567')).toBe(true);
  });
  test('-84.4567 is a valid latitude.', () => {
    expect(UserValidation.isValidLatitude('-84.4567')).toBe(true);
  });
});