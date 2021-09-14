import {
  FmlRegisteredValidators,
  registerValidator,
} from '@fml/core';

const AFTER = 'after';

declare module '@fml/core' {
  export interface FmlValidatorFactoryRegistry {
    [AFTER]: FmlValidatorFactory<Date, [after: Date, inclusive?: boolean]>;
  }
}

const after: FmlRegisteredValidators[typeof AFTER] = function after(
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
