import maxLength from './maxLength';
import { instantiateValidator } from '@fml/core';

it.each`
  maximum | value
  ${1}    | ${'te'}
  ${3}    | ${'test'}
  ${0}    | ${'t'}
`(
  'returns false if length of "$value" is above $maximum',
  ({ maximum, value }) => {
    expect(maxLength(maximum)(value)).toBe(false);
  },
);

it.each`
  maximum | value
  ${3}    | ${'te'}
  ${5}    | ${'test'}
  ${1}    | ${'t'}
`(
  'returns true if length of "$value" is below or equal to $maximum',
  ({ maximum, value }) => {
    expect(maxLength(maximum)(value)).toBe(true);
  },
);

it('is in the registry', () => {
  const validator = instantiateValidator(['maxLength', 3, '']);

  expect(validator).toBeDefined();
});
