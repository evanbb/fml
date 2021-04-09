import type {
  FmlFieldConfigurationBase,
  FmlFieldValueTypes,
  FmlValidityStatus,
  FmlValueStateChangeHandler,
  FmlValueState,
  FmlValidatorConfiguration,
  FmlControlConfiguration,
  FmlFieldConfiguration,
  FmlModelConfiguration,
  FmlListConfiguration,
  FmlControlConfigurationBase,
  FmlFieldControlRegistry,
  FmlRegisteredFieldControls,
} from './controls';
import type { FmlLayoutConfiguration } from './layouts';
import { FmlControlValidator, FmlValidator, getFactory } from './validators';

export type FmlConfiguration<TValue> =
  | FmlControlConfiguration<TValue>
  | FmlLayoutConfiguration<TValue>;

export type {
  FmlFieldControlRegistry,
  FmlRegisteredFieldControls,
  FmlControlConfigurationBase,
  FmlControlConfiguration,
  FmlFieldConfiguration,
  FmlModelConfiguration,
  FmlListConfiguration,
  FmlValidityStatus,
  FmlValueStateChangeHandler,
  FmlValueState,
  FmlValidatorConfiguration,
  FmlLayoutConfiguration,
  FmlFieldConfigurationBase,
  FmlFieldValueTypes,
};

export function instantiateValidator<TValue>(
  config: FmlValidatorConfiguration<TValue>,
): FmlControlValidator<TValue> {
  // get the appropriate validator factory for this data type
  const type = config[0];
  const factory = getFactory(type);

  const args = (config as unknown[]).slice(1, (config as unknown[]).length - 1);

  // create the validator function by applying the factory
  const func = (factory as (...x: unknown[]) => unknown)(
    ...args,
  ) as FmlValidator<TValue>;

  const invalidMessage = (config as unknown[]).slice(-1)[0] as string;

  // result is an async function that calls the validator above (which may be async itself) with the current value
  return async function (value: TValue) {
    const valid = await func(value);

    if (!valid) {
      return invalidMessage;
    }
    return;
  };
}
