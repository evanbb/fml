import {
  FmlRegisteredValidators,
  registerValidator,
} from '@fml/core';

const REQUIRED = 'required';

declare module '@fml/core' {
  export interface FmlValidatorFactoryRegistry {
    [REQUIRED]: FmlValidatorFactory;
  }
}

const required: FmlRegisteredValidators[typeof REQUIRED] = function required() {
  return function (value) {
    return !!value;
  };
};

registerValidator(REQUIRED, required);

export default required;
