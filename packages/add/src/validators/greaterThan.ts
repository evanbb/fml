import {
  RegisteredValidators,
  registerValidator,
} from '@fml/core';

const GREATER_THAN = 'greaterThan';

declare module '@fml/core' {
  export interface ValidatorFactoryRegistry {
    [GREATER_THAN]: ValidatorFactory<
      number,
      [minimum: number, inclusive?: boolean]
    >;
  }
}

const greaterThan: RegisteredValidators[typeof GREATER_THAN] =
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
