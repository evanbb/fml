/* eslint-disable @typescript-eslint/no-empty-interface */
import type { KnownKeys } from '../utils';
import type {
  FmlValidatorKeys,
  FmlValidatorFactoryRegistry,
} from '../validators';
import type { FmlConfiguration } from '../index';

//#region common stuff

/**
 * The various validity statuses in which data bound to a form control can be.
 */
export type FmlValidityStatus = 'valid' | 'pending' | 'invalid' | 'unknown';

/**
 * The state a form control maintains about a piece of data.
 */
export interface FmlValueState<TValue> {
  value: TValue;
  validity: FmlValidityStatus;
}

/**
 * Called when the value or validity of a piece of data has changed, e.g.,
 * through a user interaction or when an async validator resolves.
 */
export interface FmlValueStateChangeHandler<TValue> {
  (change: FmlValueState<TValue>): void;
}

/**
 * Basic info that every form control needs in order to configure itself to
 * render and run.
 */
export interface FmlControlConfigurationBase<TValue> {
  label: string;
  defaultValue?: TValue;
  validators?: FmlValidatorConfiguration<TValue>[];
}

/**
 * The different classifications of controls.
 */
export type FmlControlClassifications = 'field' | 'model' | 'list';

/**
 * Basic descriptor of a validator and a message to display if validation fails.
 */
export interface FmlValidatorConfigurationBase<
  TValidator extends KnownKeys<FmlValidatorFactoryRegistry>,
> {
  message: string;
  validator: TValidator;
}

/**
 * Returns the configuration required to describe a validator to apply to a
 * control.
 */
export type FmlValidatorConfiguration<TValue> = [
  FmlValidatorKeys<TValue>,
] extends [infer TValidator]
  ? TValidator extends keyof FmlValidatorFactoryRegistry
    ? [
        TValidator,
        ...Parameters<FmlValidatorFactoryRegistry[TValidator]>,
        string,
      ]
    : never
  : never;

//#endregion

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
export type FmlControlConfiguration<TValue> =
  FmlControlClassificationConfigurationRegistry<TValue>[FmlControlClassification<TValue>];

//#endregion controls

//#region fields

export type FmlFieldValueTypes = string | number | boolean | Date | undefined;

/**
 * Basic descriptor of the field to bind a value to.
 */
export interface FmlFieldConfigurationBase<
  TValue,
  TControl extends FmlRegisteredFieldControls,
> extends FmlControlConfigurationBase<TValue> {
  control: TControl;
}

/**
 * Returns a union of appropriate configurations for the provided data type.
 */
export type FmlFieldConfiguration<TValue> = FmlFieldConfigurationBase<
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

export type FmlFieldControlRegistration<TExtraConfig> = [
  FmlFieldValueTypes,
  TExtraConfig?,
];

export interface FmlOptionsListConfiguration<TValue extends string> {
  options: Record<TValue, string>;
}

/**
 * This registry contains the defined types of controls that are available to
 * bind to fields on a form.
 *
 * This interface can be extended to effectively register new (or clobber
 * existing) field controls.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FmlFieldControlRegistry<TValue> {
  [more: string]: FmlFieldControlRegistration<unknown>
}

/**
 * This returns a union of the names of registered field controls.
 */
export type FmlRegisteredFieldControls = KnownKeys<
  FmlFieldControlRegistry<never>
>;

/**
 * This returns a union of the names of registered field controls that are
 * designed for the provided data type.
 */
export type FmlFieldControlsFor<TValue> = keyof {
  [K in KnownKeys<
    FmlFieldControlRegistry<TValue>
  > as TValue extends FmlFieldControlRegistry<TValue>[K][0] ? K : never]: K;
};

const registry = new Map<FmlRegisteredFieldControls, unknown>();

/**
 * Register a field control's concrete implementation.
 * @param key The string key of the registered field control
 * @param impl The field control's implementation
 */
export function register(key: FmlRegisteredFieldControls, impl: unknown): void {
  registry.set(key, impl);
}

/**
 * Gets the field control's implementation from the registry.
 * @param key The string key of the registered field control
 * @returns The implmementation of the field control
 */
export function getFieldImplementation(
  key: FmlRegisteredFieldControls,
): unknown {
  return registry.get(key);
}

//#endregion fields

//#region models

export interface FmlModelConfiguration<TValue>
  extends FmlControlConfigurationBase<TValue> {
  schema: { [Key in keyof TValue]: FmlConfiguration<TValue[Key]> };
}

//#endregion

//#region lists

export interface FmlListConfiguration<TValue>
  extends FmlControlConfigurationBase<TValue[]> {
  itemConfig: FmlConfiguration<TValue>;
}

//#endregion
