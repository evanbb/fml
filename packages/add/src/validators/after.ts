import {
  RegisteredValidators,
  registerValidator,
} from '@fml/core';

const AFTER = 'after';

declare module '@fml/core' {
  export interface ValidatorFactoryRegistry {
    [AFTER]: ValidatorFactory<Date, [after: Date, inclusive?: boolean]>;
  }
}

const after: RegisteredValidators[typeof AFTER] = function after(
  afterDate,
  inclusive,
) {
  return inclusive
    ? function (value) {
        return value.valueOf() >= afterDate.valueOf();
      }
    : function (value) {
        return value.valueOf() > afterDate.valueOf();
      };
};

registerValidator(AFTER, after);

export default after;
