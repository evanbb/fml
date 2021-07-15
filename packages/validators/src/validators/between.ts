import { FmlRegisteredValidators, register } from '..';

const BETWEEN = 'between';

const between: FmlRegisteredValidators[typeof BETWEEN] = function between(
  { min, max },
  inclusive,
) {
  return inclusive
    ? function (value) {
        return value >= min && value <= max;
      }
    : function (value) {
        return value > min && value < max;
      };
};

register(BETWEEN, between);

export default between;
