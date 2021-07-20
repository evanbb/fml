/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  KnownKeys,
  StringOnlyNotStringUnion,
  StringUnionOnlyNotString,
} from '@fml/util-types';
import { FmlValidatorKeys, FmlValidatorFactoryRegistry } from '@fml/validators';

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
 * Arguments to invoke the validator factory function.
 */
export interface FmlValidatorWithArgsConfiguration<
  TValidator extends KnownKeys<FmlValidatorFactoryRegistry>,
> extends FmlValidatorConfigurationBase<TValidator> {
  args: Parameters<FmlValidatorFactoryRegistry[TValidator]>;
}

/**
 * Returns the configuration required to describe a validator to apply to a
 * control.
 */
export type FmlValidatorConfiguration<TValue> = {
  message: string;
  validator: FmlValidatorKeys<TValue>;
} extends {
  message: string;
  validator: infer TValidator;
}
  ? TValidator extends KnownKeys<FmlValidatorFactoryRegistry>
    ? [] extends Parameters<FmlValidatorFactoryRegistry[TValidator]>
      ? FmlValidatorConfigurationBase<TValidator>
      : FmlValidatorWithArgsConfiguration<TValidator>
    : never
  : never;

//#endregion

//#region fields

export type FmlFieldValueTypes = string | number | boolean | Date | undefined;

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
export interface FmlFieldControlRegistry<TValue>
  extends Record<string, FmlFieldControlRegistration<unknown>> {
  checkbox: [boolean | undefined];
  date: [Date | undefined];
  datetime: [Date | undefined];
  hidden: [StringOnlyNotStringUnion<TValue> | undefined];
  number: [number | undefined];
  radios: [
    StringUnionOnlyNotString<TValue>,
    [TValue] extends [string]
      ? string extends TValue
        ? never
        : FmlOptionsListConfiguration<TValue>
      : never,
  ];
  select: [
    StringUnionOnlyNotString<TValue>,
    [TValue] extends [string]
      ? string extends TValue
        ? never
        : FmlOptionsListConfiguration<TValue>
      : // todo: add support for multiple selects...
        never,
  ];
  text: [StringOnlyNotStringUnion<TValue> | undefined];
  textarea: [StringOnlyNotStringUnion<TValue> | undefined];
  toggle: [boolean | undefined];
}

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

export function register(key: FmlRegisteredFieldControls, impl: unknown): void {
  registry.set(key, impl);
}

export function getFieldImplementation(
  key: FmlRegisteredFieldControls,
): unknown {
  return registry.get(key);
}

//#endregion
