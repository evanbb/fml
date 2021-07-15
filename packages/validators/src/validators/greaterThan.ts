import { FmlRegisteredValidators, register } from '..';

const GREATER_THAN = 'greaterThan';

const greaterThan: FmlRegisteredValidators[typeof GREATER_THAN] =
  function greaterThan(min, inclusive) {
    return inclusive
      ? function (value) {
          return value >= min;
        }
      : function (value) {
          return value > min;
        };
  };

register(GREATER_THAN, greaterThan);

export default greaterThan;
