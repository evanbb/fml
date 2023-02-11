import greaterThan from './greaterThan';
import { instantiateValidator } from '@fml/core';

it.each`
  value | min
  ${5}  | ${6}
  ${5}  | ${5}
  ${1}  | ${1}
`('returns false if $value is less than $min', ({ value, min }) => {
  expect(greaterThan(min)(value)).toBe(false);
});
it.each`
  value | min
  ${7}  | ${6}
  ${6}  | ${5}
  ${3}  | ${1}
`('returns true if $value is greater than $min', ({ value, min }) => {
  expect(greaterThan(min)(value)).toBe(true);
});

it('is in the registry', () => {
  const validator = instantiateValidator(['greaterThan', 3, '']);

  expect(validator).toBeDefined();
});
