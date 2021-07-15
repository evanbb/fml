import {
  FmlFieldControlRegistry,
  FmlFieldControlsFor,
  FmlRegisteredFieldControls,
  FmlFieldConfigurationBase,
  FmlFieldValueTypes,
  FmlControlClassifications,
  FmlControlConfigurationBase,
  FmlValidityStatus,
  FmlValueStateChangeHandler,
  FmlValueState,
  FmlValidatorConfiguration,
  FmlValidatorWithArgsConfiguration,
} from '@fml/controls';
import { FmlLayoutRegistry, FmlRegisteredLayouts } from '@fml/layouts';
import { IsPartial } from '@fml/util-types';
import { FmlControlValidator, FmlValidator, getFactory } from '@fml/validators';

//#region controls

/**
 * This registry contains the defined classifications of controls that may be
 * bound to various pieces of data on a form (fields, models, and lists). It is
 * used to map to implementations of each classification, e.g., different types
 * of fields (checkboxes, text inputs, date pickers, etc.)
 */
interface FmlControlClassificationConfigurationRegistry<TValue>
  extends Record<
    FmlControlClassifications,
    TValue extends ReadonlyArray<infer TItem>
      ? FmlControlConfigurationBase<TItem[]>
      : FmlControlConfigurationBase<TValue>
  > {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  field: TValue extends ReadonlyArray<infer _>
    ? never
    : FmlFieldConfiguration<TValue>;
  list: TValue extends ReadonlyArray<infer TItem>
    ? FmlListConfiguration<TItem>
    : never;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  model: TValue extends ReadonlyArray<infer _>
    ? never
    : FmlModelConfiguration<TValue>;
}

/**
 * Returns the classification of control that can be bound to the provided
 * data type. I.e., if it is
 * 1. A field value type, it should be bound to a 'field' control
 * 2. An array of something, it should be bound to a 'list' control
 * 3. Anything else, it should be bound to a 'model' control
 */
export type FmlControlClassification<TValue> = [TValue] extends [
  FmlFieldValueTypes | undefined,
]
  ? 'field'
  : TValue extends ReadonlyArray<unknown> | undefined
  ? 'list'
  : TValue extends unknown | undefined
  ? 'model'
  : never;

/**
 * Returns the appropriate configuration type for the provided data type.
 */
type FmlControlConfiguration<
  TValue
> = FmlControlClassificationConfigurationRegistry<TValue>[FmlControlClassification<TValue>];

//#endregion controls

//#region fields

/**
 * Returns a union of appropriate configurations for the provided data type.
 */
type FmlFieldConfiguration<TValue> = FmlFieldConfigurationBase<
  TValue,
  FmlRegisteredFieldControls
> extends infer TConfig
  ? TConfig extends FmlFieldConfigurationBase<
      TValue,
      FmlRegisteredFieldControls
    >
    ? TConfig['control'] extends infer TControl
      ? TControl extends FmlFieldControlsFor<TValue>
        ? FmlFieldControlRegistry<TValue>[TControl][1] extends undefined
          ? FmlFieldConfigurationBase<TValue, TControl>
          : FmlFieldConfigurationBase<TValue, TControl> &
              FmlFieldControlRegistry<TValue>[TControl][1]
        : never
      : never
    : never
  : never;

//#endregion fields

//#region models

interface FmlModelConfiguration<TValue>
  extends FmlControlConfigurationBase<TValue> {
  schema: { [Key in keyof TValue]: FmlConfiguration<TValue[Key]> };
}

//#endregion

//#region lists

interface FmlListConfiguration<TValue>
  extends FmlControlConfigurationBase<TValue[]> {
  itemConfig: FmlConfiguration<TValue>;
}

//#endregion

//#region layouts

type FmlLayoutsFor<TValue> = keyof {
  [K in FmlRegisteredLayouts as FmlControlClassification<TValue> extends FmlLayoutRegistry<TValue>[K][0]
    ? K
    : never]: K;
};

type FmlLayoutConfiguration<
  TValue
> = FmlLayoutRegistry<TValue>[FmlLayoutsFor<TValue>][1] extends undefined
  ? [FmlLayoutsFor<TValue>, FmlConfiguration<TValue>]
  : IsPartial<FmlLayoutRegistry<TValue>[FmlLayoutsFor<TValue>][1]> extends true
  ?
      | [
          FmlLayoutsFor<TValue>,
          FmlLayoutRegistry<TValue>[FmlLayoutsFor<TValue>][1],
          FmlConfiguration<TValue>,
        ]
      | [FmlLayoutsFor<TValue>, FmlConfiguration<TValue>]
  : [
      FmlLayoutsFor<TValue>,
      FmlLayoutRegistry<TValue>[FmlLayoutsFor<TValue>][1],
      FmlConfiguration<TValue>,
    ];

//#endregion layouts

type FmlConfiguration<TValue> =
  | FmlControlConfiguration<TValue>
  | FmlLayoutConfiguration<TValue>;

export type {
  FmlControlConfiguration,
  FmlFieldConfiguration,
  FmlModelConfiguration,
  FmlListConfiguration,
  FmlValidityStatus,
  FmlValueStateChangeHandler,
  FmlValueState,
  FmlConfiguration,
  FmlValidatorConfiguration,
  FmlLayoutConfiguration,
  FmlFieldConfigurationBase,
  FmlFieldValueTypes,
};

export function instantiateValidator<TValue>(
  config: FmlValidatorConfiguration<TValue> &
    (FmlValidatorConfiguration<TValue> extends { args: [] }
      ? { args: [] }
      : unknown),
): FmlControlValidator<TValue> {
  const cfg = config as FmlValidatorWithArgsConfiguration<never>;

  // get the appropriate validator factory for this data type
  const factory = getFactory(cfg.validator);

  const args = ((config as unknown) as { args: [] }).args || [];

  // create the validator function by applying the factory
  const func = (factory(...args) as unknown) as FmlValidator<TValue>;

  // result is an async function that calls the validator above (which may be async itself) with the current value
  return async function (value: TValue) {
    const valid = await func(value);

    if (!valid) {
      return cfg.message;
    }
    return;
  };
}
