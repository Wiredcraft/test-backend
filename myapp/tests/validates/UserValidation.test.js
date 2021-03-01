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
  test(`Fields in {name: 'test1'} are all allowed.`, () => {
    const fields = {
      name: 'test1'
    };
    expect(UserValidation.areAllInputFieldsAllowed(fields)).toBe(true);
  });

  test(`Fields in {name: 'test1', dob: '2020-02-27', address: '123', description: 'student'} are all allowed.`, () => {
    const fields = {
      name: 'test1',
      dob: '2021-02-27',
      address: '123',
      description: 'student'
    };
    expect(UserValidation.areAllInputFieldsAllowed(fields)).toBe(true);
  });

  test(`Fields in {id: 1} are not allowed.`, () => {
    const fields = {
      id: 1
    };
    expect(UserValidation.areAllInputFieldsAllowed(fields)).toBe(false);
  });
});

describe('Testing isAnyRequiredFieldEmpty method:', () => {
  test(`Fields in {name: 'test1'} has empty required fields.`, () => {
    const fields = {
      name: 'test1'
    };
    expect(UserValidation.isAnyRequiredFieldEmpty(fields)).toBe(true);
  });

  test(`Fields in {name: 'test1', dob: '2021-02-28} has empty required fields.`, () => {
    const fields = {
      name: 'test1',
      dob: '2021-02-28'
    };
    expect(UserValidation.isAnyRequiredFieldEmpty(fields)).toBe(true);
  });

  test(`Fields in {name: 'test1', dob: '2020-02-27', address: '123', description: 'student'} has no empty field.`, () => {
    const fields = {
      name: 'test1',
      dob: '2021-02-27',
      address: '123',
      description: 'student'
    };
    expect(UserValidation.isAnyRequiredFieldEmpty(fields)).toBe(false);
  });
});

describe('Testing areAllRequiredFieldsEmpty method:', () => {
  test(`{name: 'test1'} has some non-empty required field.`, () => {
    const fields = {
      name: 'test1'
    };
    expect(UserValidation.areAllRequiredFieldsEmpty(fields)).toBe(false);
  });

  test(`{name: 'test1', dob: '2021-02-28} has some non-empty required fields.`, () => {
    const fields = {
      name: 'test1',
      dob: '2021-02-28'
    };
    expect(UserValidation.areAllRequiredFieldsEmpty(fields)).toBe(false);
  });

  test(`{name: 'test1', dob: '2020-02-27', address: '123', description: 'student'} has no empty required fields`, () => {
    const fields = {
      name: 'test1',
      dob: '2021-02-27',
      address: '123',
      description: 'student'
    };
    expect(UserValidation.areAllRequiredFieldsEmpty(fields)).toBe(false);
  });

  test(`{} has all required fields empty.`, () => {
    expect(UserValidation.areAllRequiredFieldsEmpty({})).toBe(true);
  });

  test(`{id: 1} has all required fields empty.`, () => {
    const fields = {
      id: 1
    };
    expect(UserValidation.areAllRequiredFieldsEmpty(fields)).toBe(true);
  });
});