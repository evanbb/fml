import { FmlRegisteredValidators, register } from '../';

const AFTER = 'after';

declare module '../' {
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

register(AFTER, after);

export default after;
