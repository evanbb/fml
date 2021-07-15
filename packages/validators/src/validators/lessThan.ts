import { FmlRegisteredValidators, register } from '..';

const LESS_THAN = 'lessThan';

const lessThan: FmlRegisteredValidators[typeof LESS_THAN] = function lessThan(
  max,
  inclusive,
) {
  return inclusive
    ? function (value) {
        return value <= max;
      }
    : function (value) {
        return value < max;
      };
};

register(LESS_THAN, lessThan);

export default lessThan;
