import {
  RegisteredValidators,
  registerValidator,
} from '@fml/core';

const BETWEEN = 'between';

declare module '@fml/core' {
  export interface ValidatorFactoryRegistry {
    [BETWEEN]: ValidatorFactory<
      number,
      [range: { min: number; max: number }, inclusive?: boolean]
    >;
  }
}

const between: RegisteredValidators[typeof BETWEEN] = function between(
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

registerValidator(BETWEEN, between);

export default between;
