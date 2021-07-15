import { FmlRegisteredValidators, register } from '..';

const REQUIRED = 'required';

const required: FmlRegisteredValidators[typeof REQUIRED] = function required() {
  return function (value) {
    return !!value;
  };
};

register(REQUIRED, required);

export default required;
