import type { KnownValidators } from '../types';

export const required: KnownValidators['required'] = function required() {
  return function (value) {
    return !!value;
  };
};

export const minLength: KnownValidators['minLength'] = function minLength(
  minLength,
) {
  return function (value) {
    return value.length >= minLength;
  };
};

export const maxLength: KnownValidators['maxLength'] = function maxLength(
  maxLength,
) {
  return function (value) {
    return value.length <= maxLength;
  };
};

export const before: KnownValidators['before'] = function before(beforeDate) {
  return function (value) {
    return value.valueOf() < beforeDate.valueOf();
  };
};

export const after: KnownValidators['after'] = function after(afterDate) {
  return function (value) {
    return value.valueOf() > afterDate.valueOf();
  };
};

export const within: KnownValidators['within'] = function within({
  before,
  after,
}) {
  return function (value) {
    return (
      value.valueOf() > after.valueOf() && value.valueOf() < before.valueOf()
    );
  };
};

export const greaterThan: KnownValidators['greaterThan'] = function greaterThan(
  min,
) {
  return function (value) {
    return value >= min;
  };
};

export const lessThan: KnownValidators['lessThan'] = function lessThan(max) {
  return function (value) {
    return value <= max;
  };
};

export const between: KnownValidators['between'] = function between({
  min,
  max,
}) {
  return function (value) {
    return value >= min && value <= max;
  };
};

export const Validators: KnownValidators = {
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
