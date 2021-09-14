import after from './after';
import { instantiateValidator } from '@fml/core';

it.each`
  date                 | min
  ${new Date(2021, 0)} | ${new Date(2020, 0)}
  ${new Date(2021, 0)} | ${new Date(1900, 0)}
  ${new Date(2021, 1)} | ${new Date(2021, 0)}
`('returns true if $date after $min', ({ date, min }) => {
  expect(after(min)(date)).toBe(true);
});

it.each`
  date                 | min
  ${new Date(2020, 0)} | ${new Date(2021, 0)}
  ${new Date(1900, 0)} | ${new Date(2021, 0)}
  ${new Date(2021, 0)} | ${new Date(2021, 0)}
`('returns false if $date is not after $min', ({ date, min }) => {
  expect(after(min)(date)).toBe(false);
});

it.each`
  date                 | min
  ${new Date(2020, 0)} | ${new Date(2020, 0)}
  ${new Date(1900, 0)} | ${new Date(1900, 0)}
  ${new Date(2021, 0)} | ${new Date(2021, 0)}
`(
  'returns true if $date is after or on $min when inclusive is set to true',
  ({ date, min }) => {
    expect(after(min, true)(date)).toBe(true);
  },
);

it('is in the registry', () => {
  const validator = instantiateValidator(['after', new Date(), false, '']);

  expect(validator).toBeDefined();
});
