import { FmlRegisteredValidators, register } from '..';

const MAX_LENGTH = 'maxLength';

const maxLength: FmlRegisteredValidators[typeof MAX_LENGTH] =
  function maxLength(maxLength) {
    return function (value) {
      return value.length <= maxLength;
    };
  };

register(MAX_LENGTH, maxLength);

export default maxLength;
