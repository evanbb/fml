import type {
  FmlKnownValidators,
  FmlControlValidator,
  FmlValidatorConfiguration,
  FmlValidatorFactory,
} from '../types';

const required: FmlKnownValidators['required'] = function required() {
  return function (value) {
    return !!value;
  };
};

const minLength: FmlKnownValidators['minLength'] = function minLength(
  minLength,
) {
  return function (value) {
    return value.length >= minLength;
  };
};

const maxLength: FmlKnownValidators['maxLength'] = function maxLength(
  maxLength,
) {
  return function (value) {
    return value.length <= maxLength;
  };
};

const before: FmlKnownValidators['before'] = function before(beforeDate) {
  return function (value) {
    return value.valueOf() < beforeDate.valueOf();
  };
};

const after: FmlKnownValidators['after'] = function after(afterDate) {
  return function (value) {
    return value.valueOf() > afterDate.valueOf();
  };
};

const within: FmlKnownValidators['within'] = function within({
  before,
  after,
}) {
  return function (value) {
    return (
      value.valueOf() > after.valueOf() && value.valueOf() < before.valueOf()
    );
  };
};

const greaterThan: FmlKnownValidators['greaterThan'] = function greaterThan(
  min,
) {
  return function (value) {
    return value >= min;
  };
};

const lessThan: FmlKnownValidators['lessThan'] = function lessThan(max) {
  return function (value) {
    return value <= max;
  };
};

const between: FmlKnownValidators['between'] = function between({ min, max }) {
  return function (value) {
    return value >= min && value <= max;
  };
};

interface ValidatorRegistration<TValue, TArgs extends ReadonlyArray<never>> {
  name: string;
  factory: FmlValidatorFactory<TValue, TArgs>;
}

export function registerValidator<TValue, TArgs extends ReadonlyArray<never>>({
  name,
  factory,
}: ValidatorRegistration<TValue, TArgs>): void {
  validators[name] = factory;
}

const validators: FmlKnownValidators = {
  required,
  minLength,
  maxLength,
  before,
  after,
  within,
  greaterThan,
  lessThan,
  between,
};

export const Validators: Readonly<FmlKnownValidators> = validators;

export function createValidator<TValue>(
  config: FmlValidatorConfiguration<TValue> & { args: [] },
): FmlControlValidator<TValue> {
  // get the appropriate validator factory for this data type
  const factory = Validators[config.validator];

  // create the validator function by applying the factory
  const func = factory(...config.args);

  // result is an async function that calls the validator above (which may be async itself) with the current value
  return async function (value: TValue) {
    const valid = await func(value);

    if (!valid) {
      return config.message;
    }
  };
}
