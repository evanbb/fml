import {
  FmlRegisteredValidators,
  registerValidator,
} from '@fml/core';

const MAX_LENGTH = 'maxLength';

declare module '@fml/core' {
  export interface FmlValidatorFactoryRegistry {
    [MAX_LENGTH]: FmlValidatorFactory<
      string | { length: number },
      [maxLength: number]
    >;
  }
}

const maxLength: FmlRegisteredValidators[typeof MAX_LENGTH] =
  function maxLength(maxLength) {
    return function (value) {
      return value.length <= maxLength;
    };
  };

registerValidator(MAX_LENGTH, maxLength);

export default maxLength;
