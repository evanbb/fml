import { FmlRegisteredValidators, register } from '../';

const BETWEEN = 'between';

declare module '../' {
  export interface FmlValidatorFactoryRegistry {
    [BETWEEN]: FmlValidatorFactory<
      number,
      [range: { min: number; max: number }, inclusive?: boolean]
    >;
  }
}

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
