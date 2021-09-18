import {
  RegisteredValidators,
  registerValidator,
} from '@fml/core';

const MAX_LENGTH = 'maxLength';

declare module '@fml/core' {
  export interface ValidatorFactoryRegistry {
    [MAX_LENGTH]: ValidatorFactory<
      string | { length: number },
      [maxLength: number]
    >;
  }
}

const maxLength: RegisteredValidators[typeof MAX_LENGTH] =
  function maxLength(maxLength) {
    return function (value) {
      return value.length <= maxLength;
    };
  };

registerValidator(MAX_LENGTH, maxLength);

export default maxLength;
