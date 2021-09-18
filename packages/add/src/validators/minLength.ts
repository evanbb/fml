import {
  RegisteredValidators,
  registerValidator,
} from '@fml/core';

const MIN_LENGTH = 'minLength';

declare module '@fml/core' {
  export interface ValidatorFactoryRegistry {
    [MIN_LENGTH]: ValidatorFactory<
      string | { length: number },
      [maxLength: number]
    >;
  }
}

const minLength: RegisteredValidators[typeof MIN_LENGTH] =
  function minLength(minLength) {
    return function (value) {
      return value.length >= minLength;
    };
  };

registerValidator(MIN_LENGTH, minLength);

export default minLength;
