import { FmlRegisteredValidators, register } from '../';

const MIN_LENGTH = 'minLength';

declare module '../' {
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

register(MIN_LENGTH, minLength);

export default minLength;
