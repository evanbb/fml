import {
  RegisteredValidators,
  registerValidator,
} from '@fml/core';

const LESS_THAN = 'lessThan';

declare module '@fml/core' {
  export interface ValidatorFactoryRegistry {
    [LESS_THAN]: ValidatorFactory<
    number, [maximum: number, inclusive?: boolean]
    >;
  }
}

const lessThan: RegisteredValidators[typeof LESS_THAN] = function lessThan(
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

registerValidator(LESS_THAN, lessThan);

export default lessThan;
