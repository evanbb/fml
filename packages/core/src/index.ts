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
export type ValidityStatus = 'valid' | 'pending' | 'invalid' | 'unknown';

/**
 * The state a form control maintains about a piece of data.
 */
export interface ValueState<TValue> {
  value: TValue;
  validity: ValidityStatus;
}

/**
 * Called when the value or validity of a piece of data has changed, e.g.,
 * through a user interaction or when an async validator resolves.
 */
export interface ValueStateChangeHandler<TValue> {
  (change: ValueState<TValue>): void;
}

/**
 * Basic info that every form control needs in order to configure itself to
 * render and run.
 */
export interface ControlConfigurationBase<TValue> {
  label: string;
  defaultValue?: TValue;
  validators?: ValidatorConfiguration<TValue>[];
}

/**
 * The different classifications of controls.
 */
export type ControlClassifications = 'field' | 'model' | 'list';

/**
 * Basic descriptor of a validator and a message to display if validation fails.
 */
export interface ValidatorConfigurationBase<
  TValidator extends KnownKeys<ValidatorFactoryRegistry>,
> {
  message: string;
  validator: TValidator;
}

/**
 * Returns the configuration required to describe a validator to apply to a
 * control.
 */
export type ValidatorConfiguration<TValue> = [
  ValidatorKeys<TValue>,
] extends [infer TValidator]
  ? TValidator extends keyof ValidatorFactoryRegistry
    ? [
        TValidator,
        ...Parameters<ValidatorFactoryRegistry[TValidator]>,
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
interface ControlClassificationConfigurationRegistry<Value>
  extends Record<
    ControlClassifications,
    Value extends ReadonlyArray<infer TItem>
      ? ControlConfigurationBase<TItem[]>
      : ControlConfigurationBase<Value>
  > {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  field: Value extends ReadonlyArray<infer _>
    ? never
    : FieldConfiguration<Value>;
  list: Value extends ReadonlyArray<infer TItem>
    ? ListConfiguration<TItem>
    : never;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  model: Value extends ReadonlyArray<infer _>
    ? never
    : ModelConfiguration<Value>;
}

/**
 * Returns the classification of control that can be bound to the provided
 * data type. I.e., if it is
 * 1. A field value type, it should be bound to a 'field' control
 * 2. An array of something, it should be bound to a 'list' control
 * 3. Anything else, it should be bound to a 'model' control
 */
export type ControlClassification<Value> = [Value] extends [
  FieldValueTypes | undefined,
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
export type ControlConfiguration<Value> =
  ControlClassificationConfigurationRegistry<Value>[ControlClassification<Value>];

//#endregion controls

//#region fields

export type FieldValueTypes = string | number | boolean | Date | undefined;

/**
 * Basic descriptor of the field to bind a value to.
 */
export interface FieldConfigurationBase<
  TValue,
  TControl extends RegisteredFieldControls,
> extends ControlConfigurationBase<TValue> {
  control: TControl;
}

/**
 * Returns a union of appropriate configurations for the provided data type.
 */
export type FieldConfiguration<TValue> = FieldConfigurationBase<
  TValue,
  RegisteredFieldControls
> extends infer TConfig
  ? TConfig extends FieldConfigurationBase<
      TValue,
      RegisteredFieldControls
    >
    ? TConfig['control'] extends infer TControl
      ? TControl extends FieldControlsFor<TValue>
        ? FieldControlRegistry<TValue>[TControl][1] extends undefined
          ? FieldConfigurationBase<TValue, TControl>
          : FieldConfigurationBase<TValue, TControl> &
              FieldControlRegistry<TValue>[TControl][1]
        : never
      : never
    : never
  : never;

export type FieldControlRegistration<TExtraConfig> = [
  FieldValueTypes,
  TExtraConfig?,
];

export interface OptionsListConfiguration<Value extends string> {
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
export interface FieldControlRegistry<Value> {
  [more: string]: FieldControlRegistration<unknown>;
}

/**
 * This returns a union of the names of registered field controls.
 */
export type RegisteredFieldControls = KnownKeys<
  FieldControlRegistry<never>
>;

/**
 * This returns a union of the names of registered field controls that are
 * designed for the provided data type.
 */
export type FieldControlsFor<Value> = keyof {
  [K in KnownKeys<
    FieldControlRegistry<Value>
  > as Value extends FieldControlRegistry<Value>[K][0] ? K : never]: K;
};

const controlRegistry = new Map<RegisteredFieldControls, unknown>();

/**
 * Register a field control's concrete implementation.
 * @param key The string key of the registered field control
 * @param impl The field control's implementation
 */
export function registerControl(
  key: RegisteredFieldControls,
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
  key: RegisteredFieldControls,
): unknown {
  return controlRegistry.get(key);
}

//#endregion fields

//#region models

export interface ModelConfiguration<TValue>
  extends ControlConfigurationBase<TValue> {
  schema: { [Key in keyof TValue]: Configuration<TValue[Key]> };
}

//#endregion

//#region lists

export interface ListConfiguration<TValue>
  extends ControlConfigurationBase<TValue[]> {
  itemConfig: Configuration<TValue>;
}

//#endregion

//#endregion

/**
 * A function that can determine the validity of the provided @argument value
 */
export interface Validator<TValue> {
  (value: TValue): boolean | Promise<boolean>;
}

/**
 * Types that a control validator may return. Multiple validators may be bound
 * to a single control, and when a validator fails, the control should return
 * the configured message for the failed validator.
 */
export type ControlValidatorReturnTypes =
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
 * @see {ValidatorConfigurationBase}
 */
export interface ControlValidator<TValue> {
  (value: TValue): ControlValidatorReturnTypes;
}

/**
 * A function that binds parameters to a validation function so the validator
 * can be invoked with just the form value to be validated.
 */
export interface ValidatorFactory<
  TValue = unknown,
  TArgs extends ReadonlyArray<unknown> = [],
> {
  (...params: TArgs): Validator<TValue>;
}

/**
 * Contains all registered validator factories.
 */
export interface ValidatorFactoryRegistry {
  readonly [more: string]: ValidatorFactory<never, never>;
}

/**
 * Returns all registered validators and their respective factories.
 */
export type RegisteredValidators = {
  [K in KnownKeys<ValidatorFactoryRegistry>]: ValidatorFactoryRegistry[K];
};

/**
 * Returns all registered validator factories that can be applied to the
 * provided data type.
 */
export type Validators<TValue> = {
  [Key in keyof RegisteredValidators as RegisteredValidators[Key] extends ValidatorFactory<
    infer TValidatorValue,
    never
  >
    ? //TODO: does it make sense to have bidi extends clauses here?
      TValidatorValue extends TValue
      ? Key
      : TValue extends TValidatorValue
      ? Key
      : never
    : never]: RegisteredValidators[Key];
};

/**
 * Returns the names of all registered validator factories that can be
 * applied to the provided data type.
 */
export type ValidatorKeys<TValue> = keyof Validators<TValue>;

/**
 * The actual registry. Don't mess with it.
 */
const validatorRegistry = {} as ValidatorFactoryRegistry;

/**
 * Registers the provided validator factory implementation at the provided name.
 * @param name The name of the validator to enter into the registry
 * @param factory The validator factory implementation
 */
export function registerValidator<
  TName extends keyof ValidatorFactoryRegistry,
>(name: TName, factory: ValidatorFactoryRegistry[TName]): void {
  validatorRegistry[name] = factory;
}

/**
 * A means of getting the validator factory registered at the provided name
 * @param name The name of the validator factory to retrieve
 * @returns The validator factory
 */
export function getFactory<TValidator extends keyof RegisteredValidators>(
  name: TValidator,
): ValidatorFactoryRegistry[TValidator] {
  return validatorRegistry[name];
}

export type Configuration<TValue> =
  | ControlConfiguration<TValue>;

export function instantiateValidator<TValue>(
  config: ValidatorConfiguration<TValue>,
): ControlValidator<TValue> {
  // get the appropriate validator factory for this data type
  const type = config[0];
  const factory = getFactory(type);

  const args = (config as unknown[]).slice(1, (config as unknown[]).length - 1);

  // create the validator function by applying the factory
  const func = (factory as (...x: unknown[]) => unknown)(
    ...args,
  ) as Validator<TValue>;

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
