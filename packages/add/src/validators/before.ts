import {
  RegisteredValidators,
  registerValidator,
} from '@fml/core';

const BEFORE = 'before';

declare module '@fml/core' {
  export interface ValidatorFactoryRegistry {
    [BEFORE]: ValidatorFactory<Date, [before: Date, inclusive?: boolean]>;
  }
}

const before: RegisteredValidators[typeof BEFORE] = function before(
  beforeDate,
  inclusive,
) {
  return inclusive
    ? function (value) {
        return value.valueOf() <= beforeDate.valueOf();
      }
    : function (value) {
        return value.valueOf() < beforeDate.valueOf();
      };
};

registerValidator(BEFORE, before);

export default before;
