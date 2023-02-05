//#region utils

export type StringUnionOnlyNotString<Value> =
  /**
   * If a) it's a tuple of [TSomethingThatExtendsString]
   * and b) the tuple is of exactly [string]
   * then we don't want it.
   * Otherwise, it must be a tuple of ['something' | 'interesting'], in which
   * case we want the single element of the tuple (the union)
   */

  Value extends [string]
  ? string extends Value[0]
  ? never
  : Value[0]
  : /**
     * Otherwise, if a) it's a TSomethingThatExtendsString
     * and b) it's exactly string
     * then we don't want it.
     * Otherwise, it must be 'something' | 'insteresting', in which case
     * we want the union
     */
  Value extends string
  ? string extends Value
  ? never
  : Value
  : never;

export type StringOnlyNotStringUnion<Value> =
  /**
   * If a) it's a TSomethingThatExtendsString
   * and b) it's exactly string
   * then it's what we want.
   * Otherwise, it must be 'something' | 'insteresting', in which case
   * we aren't interested
   */
  Value extends string ? (string extends Value ? string : never) : string;

export type KnownKeys<T> = keyof {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

export type IsPartial<T> = Partial<T> extends T ? true : false;

//#endregion

//#region controls

//#region common stuff

/**
 * The various validity statuses in which data bound to a form control can be.
 */
export type FmlValidityStatus = 'valid' | 'pending' | 'invalid' | 'unknown';

/**
 * The state a form control maintains about a piece of data.
 */
export interface FmlValueState<Value> {
  value: Value;
  validity: FmlValidityStatus;
}

/**
 * Called when the value or validity of a piece of data has changed, e.g.,
 * through a user interaction or when an async validator resolves.
 */
export interface FmlValueStateChangeHandler<Value> {
  (change: FmlValueState<Value>): void;
}

/**
 * Basic info that every form control needs in order to configure itself to
 * render and run.
 */
export interface FmlControlConfigurationBase<Value> {
  label: string;
  defaultValue?: Value;
  validators?: FmlValidatorConfiguration<Value>[];
}

/**
 * The different classifications of controls.
 */
export type FmlControlClassifications = 'field' | 'model' | 'list';

/**
 * Basic descriptor of a validator and a message to display if validation fails.
 */
export interface FmlValidatorConfigurationBase<
  Validator extends KnownKeys<FmlValidatorFactoryRegistry>,
> {
  message: string;
  validator: Validator;
}

/**
 * Returns the configuration required to describe a validator to apply to a
 * control.
 */
export type FmlValidatorConfiguration<Value> = [
  FmlValidatorKeys<Value>,
] extends [infer Validator]
  ? Validator extends keyof FmlValidatorFactoryRegistry
  ? [
    Validator,
    ...Parameters<FmlValidatorFactoryRegistry[Validator]>,
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
interface FmlControlClassificationConfigurationRegistry<Value>
  extends Record<
    FmlControlClassifications,
    Value extends ReadonlyArray<infer Item>
    ? FmlControlConfigurationBase<Item[]>
    : FmlControlConfigurationBase<Value>
  > {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  field: Value extends ReadonlyArray<infer _>
  ? never
  : FmlFieldConfiguration<Value>;
  list: Value extends ReadonlyArray<infer Item>
  ? FmlListConfiguration<Item>
  : never;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  model: Value extends ReadonlyArray<infer _>
  ? never
  : FmlModelConfiguration<Value>;
}

/**
 * Returns the classification of control that can be bound to the provided
 * data type. I.e., if it is
 * 1. A field value type, it should be bound to a 'field' control
 * 2. An array of something, it should be bound to a 'list' control
 * 3. Anything else, it should be bound to a 'model' control
 */
export type FmlControlClassification<Value> = [Value] extends [
  FmlFieldValueTypes | undefined,
]
  ? 'field'
  : Value extends ReadonlyArray<unknown> | undefined
  ? 'list'
  : Value extends unknown | undefined
  ? 'model'
  : never;

/**
 * Returns the appropriate configuration type for the provided data type.
 */
export type FmlControlConfiguration<Value> =
  FmlControlClassificationConfigurationRegistry<Value>[FmlControlClassification<Value>];

//#endregion controls

//#region fields

export type FmlFieldValueTypes = string | number | boolean | Date;

/**
 * Basic descriptor of the field to bind a value to.
 */
export interface FmlFieldConfigurationBase<
  Value,
  Control extends FmlRegisteredFieldControls = FmlRegisteredFieldControls,
> extends FmlControlConfigurationBase<Value> {
  control: Control;
  defaultValue: Value
}

/**
 * Returns a union of appropriate configurations for the provided data type.
 */
export type FmlFieldConfiguration<Value> = FmlFieldConfigurationBase<
  Value,
  FmlRegisteredFieldControls
> extends infer TConfig
  ? TConfig extends FmlFieldConfigurationBase<
    Value,
    FmlRegisteredFieldControls
  >
  ? TConfig['control'] extends infer Control
  ? Control extends FmlFieldControlsFor<Value>
  ? Control extends keyof FmlFieldControlRegistry<Value>
  ? Control extends KnownKeys<FmlFieldControlRegistry<Value>>
  ? FmlFieldControlRegistry<Value>[Control][1] extends undefined
  ? FmlFieldConfigurationBase<Value, Control>
  : FmlFieldConfigurationBase<Value, Control> &
  FmlFieldControlRegistry<Value>[Control][1]
  : never
  : never
  : never
  : never
  : never
  : never;

export type FmlFieldControlRegistration<ExtraConfig> = [
  FmlFieldValueTypes,
  ExtraConfig?,
];

export interface FmlOptionsListConfiguration<Value extends string> {
  options: Record<Value, string>;
}

/**
 * This registry contains the defined types of controls that are available to
 * bind to fields on a form.
 *
 * This interface can be extended to effectively register new (or clobber
 * existing) field controls.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FmlFieldControlRegistry<Value> {
  [more: string]: FmlFieldControlRegistration<unknown>;
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
export type FmlFieldControlsFor<Value> = keyof {
  [K in KnownKeys<
    FmlFieldControlRegistry<Value>
  > as Value extends FmlFieldControlRegistry<Value>[K][0] ? K : never]: K;
};

const controlRegistry = new Map<FmlRegisteredFieldControls, unknown>();

/**
 * Register a field control's concrete implementation.
 * @param key The string key of the registered field control
 * @param impl The field control's implementation
 */
export function registerControl(
  key: FmlRegisteredFieldControls,
  impl: unknown,
): void {
  controlRegistry.set(key, impl);
}

/**
 * Gets the field control's implementation from the registry.
 * @param key The string key of the registered field control
 * @returns The implmementation of the field control
 */
export function getFieldImplementation(
  key: FmlRegisteredFieldControls,
): unknown {
  return controlRegistry.get(key);
}

//#endregion fields

//#region models

export interface FmlModelConfiguration<Value>
  extends FmlControlConfigurationBase<Value> {
  schema: { [Key in keyof Value]: FmlConfiguration<Value[Key]> };
}

//#endregion

//#region lists

export interface FmlListConfiguration<Value>
  extends FmlControlConfigurationBase<Value[]> {
  itemConfig: FmlConfiguration<Value>;
}

//#endregion

//#endregion

/**
 * A function that can determine the validity of the provided @argument value
 */
export interface FmlValidator<Value> {
  (value: Value): boolean | Promise<boolean>;
}

/**
 * Types that a control validator may return. Multiple validators may be bound
 * to a single control, and when a validator fails, the control should return
 * the configured message for the failed validator.
 */
export type FmlControlValidatorReturnTypes =
  | string
  | string[]
  | undefined
  | void
  | Promise<string | string[] | undefined | void>;

/**
 * A function to be bound to a control that can delegate to a validator. If the
 * validator fails, the control validator should return the corresponding
 * message as configured by the
 *
 * @see {FmlValidatorConfigurationBase}
 */
export interface FmlControlValidator<Value> {
  (value: Value): FmlControlValidatorReturnTypes;
}

/**
 * A function that binds parameters to a validation function so the validator
 * can be invoked with just the form value to be validated.
 */
export interface FmlValidatorFactory<
  Value = unknown,
  Args extends ReadonlyArray<unknown> = [],
> {
  (...params: Args): FmlValidator<Value>;
}

/**
 * Contains all registered validator factories.
 */
export interface FmlValidatorFactoryRegistry {
  readonly [more: string]: FmlValidatorFactory<never, never>;
}

/**
 * Returns all registered validators and their respective factories.
 */
export type FmlRegisteredValidators = {
  [K in KnownKeys<FmlValidatorFactoryRegistry>]: FmlValidatorFactoryRegistry[K];
};

/**
 * Returns all registered validator factories that can be applied to the
 * provided data type.
 */
export type FmlValidators<Value> = {
  [Key in keyof FmlRegisteredValidators as FmlRegisteredValidators[Key] extends FmlValidatorFactory<
    infer ValidatorValue,
    never
  >
  ? //TODO: does it make sense to have bidi extends clauses here?
  ValidatorValue extends Value
  ? Key
  : Value extends ValidatorValue
  ? Key
  : never
  : never]: FmlRegisteredValidators[Key];
};

/**
 * Returns the names of all registered validator factories that can be
 * applied to the provided data type.
 */
export type FmlValidatorKeys<Value> = keyof FmlValidators<Value>;

export type FmlConfiguration<Value> = FmlControlConfiguration<Value>;

import {
  registerValidator,
  // these should go away
  instantiateValidator,
  getValidatorFactory
} from './state/Validators'
import { createStateFromConfig } from './state/FormState'
// these should go away
import { createFieldStateFromConfig } from './state/FieldState'
import { createListStateFromConfig } from './state/ListState'
import { createModelStateFromConfig } from './state/ModelState'

export { registerValidator, instantiateValidator, getValidatorFactory }
export { createStateFromConfig, createFieldStateFromConfig, createModelStateFromConfig, createListStateFromConfig }
