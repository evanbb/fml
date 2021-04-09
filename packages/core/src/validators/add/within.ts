import { FmlRegisteredValidators, register } from '../';

const WITHIN = 'within';

declare module '../' {
  export interface FmlValidatorFactoryRegistry {
    [WITHIN]: FmlValidatorFactory<
      Date,
      [dateRange: { after: Date; before: Date }, inclusive?: boolean]
    >;
  }
}

const within: FmlRegisteredValidators[typeof WITHIN] = function within(
  { before, after },
  inclusive,
) {
  return inclusive
    ? function (value) {
        return (
          value.valueOf() >= after.valueOf() &&
          value.valueOf() <= before.valueOf()
        );
      }
    : function (value) {
        return (
          value.valueOf() > after.valueOf() &&
          value.valueOf() < before.valueOf()
        );
      };
};

register(WITHIN, within);

export default within;
