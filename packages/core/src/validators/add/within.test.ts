import within from './within';
import { getFactory } from '../';

it.each`
  date                 | after                | before
  ${new Date(2021, 1)} | ${new Date(2021, 0)} | ${new Date(2021, 2)}
  ${new Date(1900, 5)} | ${new Date(1900, 0)} | ${new Date(1901, 0)}
  ${new Date(2020, 6)} | ${new Date(2020, 0)} | ${new Date(2021, 0)}
`(
  'returns true if $date is between $after and $before',
  ({ date, after, before }) => {
    expect(within({ after, before })(date)).toBe(true);
  },
);

it.each`
  date                 | after                | before
  ${new Date(2020, 0)} | ${new Date(2021, 0)} | ${new Date(2021, 2) /* date is prior to min */}
  ${new Date(2021, 3)} | ${new Date(1900, 0)} | ${new Date(2021, 2) /* date is post max */}
  ${new Date(2020, 0)} | ${new Date(2020, 0)} | ${new Date(2021, 2) /* date is equal to min */}
  ${new Date(2021, 2)} | ${new Date(2020, 0)} | ${new Date(2021, 2) /* date is equal to max */}
`(
  'returns false if $date is not between $after and $before',
  ({ date, after, before }) => {
    expect(within({ after, before })(date)).toBe(false);
  },
);

it.each`
  date                 | after                | before
  ${new Date(2021, 0)} | ${new Date(2021, 0)} | ${new Date(2021, 2)}
  ${new Date(1901, 0)} | ${new Date(1900, 0)} | ${new Date(1901, 0)}
  ${new Date(2020, 0)} | ${new Date(2020, 0)} | ${new Date(2020, 0)}
`(
  'returns true if $date is after or on $after and before or on $before when inclusive is set to true',
  ({ date, after, before }) => {
    expect(within({ after, before }, true)(date)).toBe(true);
  },
);

it('is in the registry', () => {
  const validator = getFactory('within')({
    after: new Date(),
    before: new Date(),
  });

  expect(validator).toBeDefined();
});
