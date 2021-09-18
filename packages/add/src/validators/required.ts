import {
  RegisteredValidators,
  registerValidator,
} from '@fml/core';

const REQUIRED = 'required';

declare module '@fml/core' {
  export interface ValidatorFactoryRegistry {
    [REQUIRED]: ValidatorFactory;
  }
}

const required: RegisteredValidators[typeof REQUIRED] = function required() {
  return function (value) {
    return !!value;
  };
};

registerValidator(REQUIRED, required);

export default required;
