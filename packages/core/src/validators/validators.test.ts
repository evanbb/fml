import { createValidator, Validators } from './validators';
import type {
  FmlKnownValidators,
  FmlKnownValidatorKeys,
  FmlValidator,
} from '../types';

const {
  required,
  minLength,
  maxLength,
  before,
  after,
  within,
  greaterThan,
  lessThan,
  between,
} = Validators;

describe('required', () => {
  it.each`
    value
    ${0}
    ${false}
    ${undefined}
    ${null}
    ${''}
  `('returns false if $value is falsey', ({ value }) => {
    expect(required()(value)).toBe(false);
  });

  it.each`
    value
    ${1}
    ${true}
    ${{}}
    ${[]}
    ${'stuff'}
  `('returns true if $value is truthy', ({ value }) => {
    expect(required()(value)).toBe(true);
  });
});

describe('minLength', () => {
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
});

describe('maxLength', () => {
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
});

describe('before', () => {
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
});

describe('after', () => {
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
});

describe('within', () => {
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
});

describe('greaterThan', () => {
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
  it.each`
    value | min
    ${7}  | ${7}
    ${6}  | ${5}
    ${1}  | ${1}
  `(
    'returns true if $value is greater than or equal to $min when inclusive is set to true',
    ({ value, min }) => {
      expect(greaterThan(min, true)(value)).toBe(true);
    },
  );
});

describe('lessThan', () => {
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
  it.each`
    value | max
    ${7}  | ${7}
    ${5}  | ${5}
    ${1}  | ${1}
  `(
    'returns true if $value is less than or equal to $max when inclusive is set to true',
    ({ value, max }) => {
      expect(lessThan(max, true)(value)).toBe(true);
    },
  );
});

describe('between', () => {
  it.each`
    value | min  | max
    ${5}  | ${4} | ${6}
    ${5}  | ${3} | ${7}
    ${1}  | ${0} | ${2}
  `(
    'returns true if $value is between $min and $max',
    ({ value, min, max }) => {
      expect(between({ min, max })(value)).toBe(true);
    },
  );
  it.each`
    value | min  | max
    ${7}  | ${4} | ${6}
    ${1}  | ${3} | ${5}
    ${3}  | ${0} | ${1}
  `(
    'returns false if $value is between $min and $max',
    ({ value, min, max }) => {
      expect(between({ min, max })(value)).toBe(false);
    },
  );
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
});

describe('createValidator', () => {
  it.each(Object.keys(Validators) as FmlKnownValidatorKeys[])(
    'invokes the factory for "%s", returning the appropriate validator',
    async (validatorType) => {
      type ArgsMap = {
        [K in FmlKnownValidatorKeys]: Parameters<FmlKnownValidators[K]>;
      };

      type AssertionMap = {
        [K in FmlKnownValidatorKeys]: ReturnType<
          FmlKnownValidators[K]
        > extends FmlValidator<infer U>
          ? U
          : never;
      };

      const argsMap: ArgsMap = {
        after: [new Date(2021, 0)],
        before: [new Date(2021, 0)],
        between: [{ min: 5, max: 10 }],
        greaterThan: [12],
        lessThan: [9],
        maxLength: [4],
        minLength: [7],
        required: [],
        within: [{ after: new Date(2021, 0), before: new Date(2021, 4) }],
      };

      const positiveAssertionMap: AssertionMap = {
        after: new Date(2021, 3),
        before: new Date(2020, 0),
        between: 8,
        greaterThan: 15,
        lessThan: 6,
        maxLength: '123',
        minLength: '12345678',
        required: 'test',
        within: new Date(2021, 2),
      };

      const negativeAssertionMap: AssertionMap = {
        after: new Date(2020, 0),
        before: new Date(2021, 3),
        between: 11,
        greaterThan: 11,
        lessThan: 11,
        maxLength: '12345',
        minLength: '123',
        required: null,
        within: new Date(1999, 11, 31),
      };

      const validator = createValidator({
        validator: validatorType,
        args: argsMap[validatorType],
        message: 'Oh, dang',
      } as any);

      expect(await validator(positiveAssertionMap[validatorType])).toBe(
        undefined,
      );
      expect(await validator(negativeAssertionMap[validatorType])).toBe(
        'Oh, dang',
      );
    },
  );
});
