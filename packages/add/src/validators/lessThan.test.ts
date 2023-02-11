import lessThan from './lessThan';
import { instantiateValidator } from '@fml/core';

it.each`
  value | max
  ${5}  | ${6}
  ${5}  | ${7}
  ${1}  | ${2}
`('returns true if $value is less than $max', ({ value, max }) => {
  expect(lessThan(max)(value)).toBe(true);
});
it.each`
  value | max
  ${7}  | ${6}
  ${6}  | ${5}
  ${3}  | ${1}
`('returns false if $value is less than $max', ({ value, max }) => {
  expect(lessThan(max)(value)).toBe(false);
});

it('is in the registry', () => {
  const validator = instantiateValidator(['lessThan', 3, '']);

  expect(validator).toBeDefined();
});
