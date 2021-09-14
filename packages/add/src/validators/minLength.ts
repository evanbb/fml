import {
  FmlRegisteredValidators,
  registerValidator,
} from '@fml/core';

const MIN_LENGTH = 'minLength';

declare module '@fml/core' {
  export interface FmlValidatorFactoryRegistry {
    [MIN_LENGTH]: FmlValidatorFactory<
      string | { length: number },
      [maxLength: number]
    >;
  }
}

const minLength: FmlRegisteredValidators[typeof MIN_LENGTH] =
  function minLength(minLength) {
    return function (value) {
      return value.length >= minLength;
    };
  };

registerValidator(MIN_LENGTH, minLength);

export default minLength;
