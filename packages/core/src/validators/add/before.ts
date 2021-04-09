import { FmlRegisteredValidators, register } from '../';

const BEFORE = 'before';

declare module '../' {
  export interface FmlValidatorFactoryRegistry {
    [BEFORE]: FmlValidatorFactory<Date, [before: Date, inclusive?: boolean]>;
  }
}

const before: FmlRegisteredValidators[typeof BEFORE] = function before(
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

register(BEFORE, before);

export default before;
