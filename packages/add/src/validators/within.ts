import {
  RegisteredValidators,
  registerValidator,
} from '@fml/core';

const WITHIN = 'within';

declare module '@fml/core' {
  export interface ValidatorFactoryRegistry {
    [WITHIN]: ValidatorFactory<
      Date,
      [dateRange: { after: Date; before: Date }, inclusive?: boolean]
    >;
  }
}

const within: RegisteredValidators[typeof WITHIN] = function within(
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

registerValidator(WITHIN, within);

export default within;
