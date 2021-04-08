import type {
  FmlKnownValidators,
  FmlControlValidator,
  FmlValidatorConfiguration,
  FmlValidatorFactory,
  FmlValidatorRegistry,
  FmlKnownValidatorKeys,
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

const before: FmlKnownValidators['before'] = function before(
  beforeDate,
  inclusive,
) {
  return inclusive
    ? function (value) {
        return value.valueOf() <= beforeDate.valueOf();
      }
    : function (value) {
        return value.valueOf() < beforeDate.valueOf();
      };
};

const after: FmlKnownValidators['after'] = function after(
  afterDate,
  inclusive,
) {
  return inclusive
    ? function (value) {
        return value.valueOf() >= afterDate.valueOf();
      }
    : function (value) {
        return value.valueOf() > afterDate.valueOf();
      };
};

const within: FmlKnownValidators['within'] = function within(
  { before, after },
  inclusive,
) {
  return inclusive
    ? function (value) {
        return (
          value.valueOf() >= after.valueOf() &&
          value.valueOf() <= before.valueOf()
        );
      }
    : function (value) {
        return (
          value.valueOf() > after.valueOf() &&
          value.valueOf() < before.valueOf()
        );
      };
};

const greaterThan: FmlKnownValidators['greaterThan'] = function greaterThan(
  min,
  inclusive,
) {
  return inclusive
    ? function (value) {
        return value >= min;
      }
    : function (value) {
        return value > min;
      };
};

const lessThan: FmlKnownValidators['lessThan'] = function lessThan(
  max,
  inclusive,
) {
  return inclusive
    ? function (value) {
        return value <= max;
      }
    : function (value) {
        return value < max;
      };
};

const between: FmlKnownValidators['between'] = function between(
  { min, max },
  inclusive,
) {
  return inclusive
    ? function (value) {
        return value >= min && value <= max;
      }
    : function (value) {
        return value > min && value < max;
      };
};

export function registerValidator<TValue>() {
  return function doRegistration<
    TName extends FmlKnownValidatorKeys,
    TArgs extends ReadonlyArray<unknown>
  >(name: TName, factory: FmlValidatorFactory<TValue, TArgs>): void {
    (validators as any)[name] = factory;
  };
}

export const validators: FmlValidatorRegistry = {
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
  config: FmlValidatorConfiguration<TValue> &
    (FmlValidatorConfiguration<TValue> extends { args: [] }
      ? { args: [] }
      : unknown),
): FmlControlValidator<TValue> {
  // get the appropriate validator factory for this data type
  const factory = Validators[config.validator];

  // create the validator function by applying the factory
  const func = factory(...((config as any).args || []));

  // result is an async function that calls the validator above (which may be async itself) with the current value
  return async function (value: TValue) {
    const valid = await func(value as any);

    if (!valid) {
      return config.message;
    }
    return;
  };
}
