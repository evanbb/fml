import {
  FmlRegisteredValidators,
  registerValidator,
} from '@fml/core';

const LESS_THAN = 'lessThan';

declare module '@fml/core' {
  export interface FmlValidatorFactoryRegistry {
    [LESS_THAN]: FmlValidatorFactory<
    number, [maximum: number, inclusive?: boolean]
    >;
  }
}

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

registerValidator(LESS_THAN, lessThan);

export default lessThan;
