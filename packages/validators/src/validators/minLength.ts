import { FmlRegisteredValidators, register } from '..';

const MIN_LENGTH = 'minLength';

const minLength: FmlRegisteredValidators[typeof MIN_LENGTH] =
  function minLength(minLength) {
    return function (value) {
      return value.length >= minLength;
    };
  };

register(MIN_LENGTH, minLength);

export default minLength;
