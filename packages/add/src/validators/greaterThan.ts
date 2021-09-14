import {
  FmlRegisteredValidators,
  registerValidator,
} from '@fml/core';

const GREATER_THAN = 'greaterThan';

declare module '@fml/core' {
  export interface FmlValidatorFactoryRegistry {
    [GREATER_THAN]: FmlValidatorFactory<
      number,
      [minimum: number, inclusive?: boolean]
    >;
  }
}

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

registerValidator(GREATER_THAN, greaterThan);

export default greaterThan;
