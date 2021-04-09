import { FmlRegisteredValidators, register } from '../';

const MAX_LENGTH = 'maxLength';

declare module '../' {
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

register(MAX_LENGTH, maxLength);

export default maxLength;
