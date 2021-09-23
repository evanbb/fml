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

//#endregion utils

//#region controls

/**
 * The various validity statuses in which data bound to a form control can be.
 */
export type ValidityStatus = 'valid' | 'pending' | 'invalid' | 'unknown';

/**
 * The state a form control maintains about a piece of data.
 */
export interface ValueState<Value> {
  value: Value;
  validity: ValidityStatus;
}

/**
 * Called when the value or validity of a piece of data has changed, e.g.,
 * through a user interaction or when an async validator resolves.
 */
export interface ValueStateChangeHandler<Value> {
  (change: ValueState<Value>): void;
}

/**
 * Basic info that every form control needs in order to configure itself to
 * render and run.
 */
export interface ControlConfigurationBase<Value> {
  label: string;
  defaultValue?: Value;
  validators?: ValidatorConfiguration<Value>[];
}

/**
 * Returns the configuration required to describe a validator to apply to a
 * control.
 */
export type ValidatorConfiguration<Value> = [ValidatorKeys<Value>] extends [
  infer TValidator,
]
  ? TValidator extends keyof ValidatorFactoryRegistry
    ? [TValidator, ...Parameters<ValidatorFactoryRegistry[TValidator]>, string]
    : never
  : never;

/**
 * A function that can determine the validity of the provided @argument value
 */
export interface Validator<Value> {
  (value: Value): boolean | Promise<boolean>;
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
export interface ControlValidator<Value> {
  (value: Value): ControlValidatorReturnTypes;
}

/**
 * A function that binds parameters to a validation function so the validator
 * can be invoked with just the form value to be validated.
 */
export interface ValidatorFactory<
  Value = unknown,
  TArgs extends ReadonlyArray<unknown> = [],
> {
  (...params: TArgs): Validator<Value>;
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
export type Validators<Value> = {
  [Key in keyof RegisteredValidators as RegisteredValidators[Key] extends ValidatorFactory<
    infer TValidatorValue,
    never
  >
    ? //TODO: does it make sense to have bidi extends clauses here?
      TValidatorValue extends Value
      ? Key
      : Value extends TValidatorValue
      ? Key
      : never
    : never]: RegisteredValidators[Key];
};

/**
 * Returns the names of all registered validator factories that can be
 * applied to the provided data type.
 */
export type ValidatorKeys<Value> = keyof Validators<Value>;

/**
 * The actual registry. Don't mess with it.
 */
const validatorRegistry = {} as ValidatorFactoryRegistry;

/**
 * Registers the provided validator factory implementation at the provided name.
 * @param name The name of the validator to enter into the registry
 * @param factory The validator factory implementation
 */
export function registerValidator<TName extends keyof ValidatorFactoryRegistry>(
  name: TName,
  factory: ValidatorFactoryRegistry[TName],
): void {
  validatorRegistry[name] = factory;
}

/**
 * A means of getting the validator factory registered at the provided name
 * @param name The name of the validator factory to retrieve
 * @returns The validator factory
 */
export function getValidatorFactory<
  TValidator extends keyof RegisteredValidators,
>(name: TValidator): ValidatorFactoryRegistry[TValidator] {
  return validatorRegistry[name];
}

export function instantiateValidator<Value>(
  config: ValidatorConfiguration<Value>,
): ControlValidator<Value> {
  // get the appropriate validator factory for this data type
  const type = config[0];
  const factory = getValidatorFactory(type);

  const args = (config as unknown[]).slice(1, (config as unknown[]).length - 1);

  // create the validator function by applying the factory
  const func = (factory as (...x: unknown[]) => unknown)(
    ...args,
  ) as Validator<Value>;

  const invalidMessage = (config as unknown[]).slice(-1)[0] as string;

  // result is an async function that calls the validator above (which may be async itself) with the current value
  return async function (value: Value) {
    const valid = await func(value);

    if (!valid) {
      return invalidMessage;
    }
    return;
  };
}

//#endregion controls

//#region components

export type ComponentRegistration<
  Value,
  Config,
  Children extends ReadonlyArray<unknown> = [],
> = [Value, Config?, ...Children];

export interface OptionsListConfiguration<Value extends string>
  extends ControlConfigurationBase<Value> {
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
export interface ComponentRegistry<Value> {
  [more: string]: ComponentRegistration<Value, unknown, unknown[]>;
}

/**
 * This returns a union of the names of registered field controls.
 */
export type RegisteredComponents = KnownKeys<ComponentRegistry<never>>;

/**
 * This returns a union of the names of registered field controls that are
 * designed for the provided data type.
 */
type ConfigurationFor<Value> = keyof {
  [K in KnownKeys<
    ComponentRegistry<Value>
  > as Value extends ComponentRegistry<Value>[K][0] ? K : never]: K;
};

export type Configuration<Value> = [ConfigurationFor<Value>] extends [
  infer ComponentKey,
]
  ? ComponentKey extends keyof ComponentRegistry<Value>
    ? ComponentRegistry<Value>[ComponentKey] extends ComponentRegistration<
        infer Value,
        infer Configuration,
        infer ValidChildren
      >
      ? Configuration extends undefined
        ? [ComponentKey]
        : [ComponentKey, Configuration, ...ValidChildren]
      : never
    : never
  : never;

const componentRegistry = new Map<RegisteredComponents, unknown>();

/**
 * Register a field control's concrete implementation.
 * @param key The string key of the registered field control
 * @param impl The field control's implementation
 */
export function registerComponent<Implementation>(
  key: RegisteredComponents,
  impl: Implementation,
): void {
  componentRegistry.set(key, impl);
}

/**
 * Gets the field control's implementation from the registry.
 * @param key The string key of the registered field control
 * @returns The implmementation of the field control
 */
export function getComponentImplementation<Implementation>(
  key: RegisteredComponents,
): Implementation {
  return componentRegistry.get(key) as Implementation;
}

//#endregion components
