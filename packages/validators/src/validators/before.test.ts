import before from './before';
import { getFactory } from '../';

it.each`
  date                 | max
  ${new Date(2021, 0)} | ${new Date(2020, 0)}
  ${new Date(2021, 0)} | ${new Date(1900, 0)}
  ${new Date(2021, 0)} | ${new Date(2021, 0)}
`('returns false if $date is not before $max', ({ date, max }) => {
  expect(before(max)(date)).toBe(false);
});

it.each`
  date                 | max
  ${new Date(2020, 0)} | ${new Date(2021, 0)}
  ${new Date(1900, 0)} | ${new Date(2021, 0)}
  ${new Date(2021, 0)} | ${new Date(2021, 1)}
`('returns true if $date is before $max', ({ date, max }) => {
  expect(before(max)(date)).toBe(true);
});

it.each`
  date                 | max
  ${new Date(2020, 0)} | ${new Date(2020, 0)}
  ${new Date(1900, 0)} | ${new Date(1900, 0)}
  ${new Date(2021, 0)} | ${new Date(2021, 0)}
`(
  'returns true if $date is before or on $max when inclusive is set to true',
  ({ date, max }) => {
    expect(before(max, true)(date)).toBe(true);
  },
);

it('is in the registry', () => {
  const validator = getFactory('before')(new Date());

  expect(validator).toBeDefined();
});
