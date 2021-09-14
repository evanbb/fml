import minLength from './minLength';
import { instantiateValidator } from '@fml/core';

it.each`
  minimum | value
  ${3}    | ${'te'}
  ${5}    | ${'test'}
  ${2}    | ${'t'}
`(
  'returns false if length of "$value" is below $minimum',
  ({ minimum, value }) => {
    expect(minLength(minimum)(value)).toBe(false);
  },
);

it.each`
  minimum | value
  ${1}    | ${'te'}
  ${4}    | ${'test'}
  ${1}    | ${'t'}
`(
  'returns true if length of "$value" is above or equal to $minimum',
  ({ minimum, value }) => {
    expect(minLength(minimum)(value)).toBe(true);
  },
);

it('is in the registry', () => {
  const validator = instantiateValidator(['minLength', 3, '']);

  expect(validator).toBeDefined();
});
