import between from './between';
import { getFactory } from '../';

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
it.each`
  value | min  | max
  ${7}  | ${4} | ${7}
  ${3}  | ${3} | ${5}
  ${1}  | ${0} | ${2}
`(
  'returns true if $value is greater than or equal to $min and less than or equal to $max when inclusive is set to true',
  ({ value, min, max }) => {
    expect(between({ min, max }, true)(value)).toBe(true);
  },
);

it('is in the registry', () => {
  const validator = getFactory('between')({
    min: 3,
    max: 4,
  });

  expect(validator).toBeDefined();
});
