import {
  FmlRegisteredValidators,
  registerValidator,
} from '@fml/core';

const WITHIN = 'within';

declare module '@fml/core' {
  export interface FmlValidatorFactoryRegistry {
    [WITHIN]: FmlValidatorFactory<
      Date,
      [dateRange: { after: Date; before: Date }]
    >;
  }
}

const within: FmlRegisteredValidators[typeof WITHIN] = function within(
  { before, after }
) {
  return function (value) {
    return (
      value.valueOf() > after.valueOf() &&
      value.valueOf() < before.valueOf()
    );
  };
};

registerValidator(WITHIN, within);

export default within;
