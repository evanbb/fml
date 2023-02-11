import between from './between';
import { instantiateValidator } from '@fml/core';

it.each`
  value | min  | max
  ${5}  | ${4} | ${6}
  ${5}  | ${3} | ${7}
  ${1}  | ${0} | ${2}
`('returns true if $value is between $min and $max', ({ value, min, max }) => {
  expect(between({ min, max })(value)).toBe(true);
});
it.each`
  value | min  | max
  ${7}  | ${4} | ${6}
  ${1}  | ${3} | ${5}
  ${3}  | ${0} | ${1}
`('returns false if $value is between $min and $max', ({ value, min, max }) => {
  expect(between({ min, max })(value)).toBe(false);
});

it('is in the registry', () => {
  const validator = instantiateValidator(['between', {
    min: 3,
    max: 4,
  }, '']);
  
  expect(validator).toBeDefined();
});
