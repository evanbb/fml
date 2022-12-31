//#region utils

export type StringUnionOnlyNotString<TValue> =
  /**
   * If a) it's a tuple of [TSomethingThatExtendsString]
   * and b) the tuple is of exactly [string]
   * then we don't want it.
   * Otherwise, it must be a tuple of ['something' | 'interesting'], in which
   * case we want the single element of the tuple (the union)
   */

  TValue extends [string]
  ? string extends TValue[0]
  ? never
  : TValue[0]
  : /**
     * Otherwise, if a) it's a TSomethingThatExtendsString
     * and b) it's exactly string
     * then we don't want it.
     * Otherwise, it must be 'something' | 'insteresting', in which case
     * we want the union
     */
  TValue extends string
  ? string extends TValue
  ? never
  : TValue
  : never;

export type StringOnlyNotStringUnion<TValue> =
  /**
   * If a) it's a TSomethingThatExtendsString
   * and b) it's exactly string
   * then it's what we want.
   * Otherwise, it must be 'something' | 'insteresting', in which case
   * we aren't interested
   */
  TValue extends string ? (string extends TValue ? string : never) : string;

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
  ? TControl extends keyof FmlFieldControlRegistry<TValue>
  ? TControl extends KnownKeys<FmlFieldControlRegistry<TValue>>
  ? FmlFieldControlRegistry<TValue>[TControl][1] extends undefined
  ? FmlFieldConfigurationBase<TValue, TControl>
  : FmlFieldConfigurationBase<TValue, TControl> &
  FmlFieldControlRegistry<TValue>[TControl][1]
  : never
  : never
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
export type FmlFieldControlsFor<TValue> = keyof {
  [K in KnownKeys<
    FmlFieldControlRegistry<TValue>
  > as TValue extends FmlFieldControlRegistry<TValue>[K][0] ? K : never]: K;
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

//#endregion

/**
 * A function that can determine the validity of the provided @argument value
 */
export interface FmlValidator<TValue> {
  (value: TValue): boolean | Promise<boolean>;
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
export interface FmlControlValidator<TValue> {
  (value: TValue): FmlControlValidatorReturnTypes;
}

/**
 * A function that binds parameters to a validation function so the validator
 * can be invoked with just the form value to be validated.
 */
export interface FmlValidatorFactory<
  TValue = unknown,
  TArgs extends ReadonlyArray<unknown> = [],
> {
  (...params: TArgs): FmlValidator<TValue>;
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
export type FmlValidators<TValue> = {
  [Key in keyof FmlRegisteredValidators as FmlRegisteredValidators[Key] extends FmlValidatorFactory<
    infer TValidatorValue,
    never
  >
  ? //TODO: does it make sense to have bidi extends clauses here?
  TValidatorValue extends TValue
  ? Key
  : TValue extends TValidatorValue
  ? Key
  : never
  : never]: FmlRegisteredValidators[Key];
};

/**
 * Returns the names of all registered validator factories that can be
 * applied to the provided data type.
 */
export type FmlValidatorKeys<TValue> = keyof FmlValidators<TValue>;

/**
 * The actual registry. Don't mess with it.
 */
const validatorRegistry = {} as FmlValidatorFactoryRegistry;

/**
 * Registers the provided validator factory implementation at the provided name.
 * @param name The name of the validator to enter into the registry
 * @param factory The validator factory implementation
 */
export function registerValidator<
  TName extends keyof FmlValidatorFactoryRegistry,
>(name: TName, factory: FmlValidatorFactoryRegistry[TName]): void {
  validatorRegistry[name] = factory;
}

/**
 * A means of getting the validator factory registered at the provided name
 * @param name The name of the validator factory to retrieve
 * @returns The validator factory
 */
export function getFactory<TValidator extends keyof FmlRegisteredValidators>(
  name: TValidator,
): FmlValidatorFactoryRegistry[TValidator] {
  return validatorRegistry[name];
}

export type FmlConfiguration<TValue> = FmlControlConfiguration<TValue>;

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
