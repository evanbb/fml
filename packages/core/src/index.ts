//#region utils

/**
 * Helps make cases when a conditional type returns `never` more descriptive.
 *
 * Take the example below:
 *
 * ```ts
 * X<Y> = Y extends string ? Y : never;
 *
 * // the error displayed is not super helpful:
 * // type 'number' is not assignable to type 'never'
 * const x: X<123> = 123;
 * ```
 *
 * It would be nicer to be able to specify *why* the type is `never`, e.g.:
 *
 * ```ts
 * X<Y> = Y extends string
 *    ? Y
 *    : NeverBecause<`Y has to be a ${string}!`>;
 *
 * // now, this error message is much more helpful!
 * // type 'number' is not assignable to type 'Y has to be a ${string}!'
 * const x: X<123> = 123;
 * ```
 */
type NeverBecause<Message extends string> = `${Message}`;

/**
 * Just prefix all FML errors with this to distinguish them from other
 * TypeScript errors.
 */
export type FmlNeverBecause<Message extends string> =
  NeverBecause<`FML: Error: ${Message}`>;

export type StringUnionOnlyNotString<Value> =
  /**
   * If a) it's a tuple of [TSomethingThatExtendsString]
   * and b) the tuple is of exactly [string]
   * then we don't want it.
   * Otherwise, it must be a tuple of ['something' | 'interesting'], in which
   * case we want the single element of the tuple (the union).
   */
  Value extends [string]
    ? string extends Value[0]
      ? FmlNeverBecause<`Looks like the Value you passed is a tuple containing exactly the type ${Value[0]}. This configuration requires a union of strings be specified, e.g. 'one' | 'two' | 'three'.`>
      : Value[0]
    : /**
     * Otherwise, if a) it's a TSomethingThatExtendsString
     * and b) it's exactly string
     * then we don't want it.
     * Otherwise, it must be 'something' | 'interesting', in which case
     * we want the union.
     */
    Value extends string
    ? string extends Value
      ? FmlNeverBecause<`Looks like the Value you passed is the type ${Value}. This configuration requires a union of strings be specified, e.g., 'one' | 'two' | 'three'.`>
      : Value
    : FmlNeverBecause<`I'm not sure what kind of value you passed me, but it isn't assignable to a string union.`>;

export type StringOnlyNotStringUnion<Value> =
  /**
   * If a) it's a TSomethingThatExtendsString
   * and b) it's exactly string
   * then it's what we want.
   * Otherwise, it must be 'something' | 'insteresting', in which case
   * we aren't interested.
   */
  Value extends string
    ? string extends Value
      ? string
      : FmlNeverBecause<`Looks like the Value you passed is a string union. This configuration requires specifically the type ${string}.`>
    : string;

/**
 * Returns the keys of T, excluding the index signature.
 *
 * E.g.:
 *
 * ```ts
 * interface Foo {
 *  bar: string;
 *  baz: number;
 *  [others: string]: unknown;
 * }
 *
 * type KnownKeysOfFoo = KnownKeys<Foo>; // 'bar' | 'baz'
 * ```
 */
export type KnownKeys<T> = keyof {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

/**
 * Returns `true` iff T contains only optional properties, else `false`.
 *
 * E.g.,
 *
 * ```ts
 * interface Foo {
 *  bar?: string;
 *  baz?: number;
 * }
 *
 * type IsFooPartial = IsPartial<Foo>; // true
 * ```
 */
export type IsPartial<T> = Partial<T> extends T ? true : false;

//#endregion utils

//#region controls

/**
 * Types that presumeably would be bound to a single form field.
 */
export type FieldValueTypes = string | number | boolean | Date | undefined;

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
 * through a user interaction or when a (potentially async) validator resolves.
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
 * message as configured by the `ValidatorConfiguration`
 *
 * @see {ValidatorConfiguration}
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
    ? TValidatorValue extends Value
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
 * @param name The name of the validator to enter into the registry.
 * @param factory The validator factory implementation.
 */
export function registerValidator<TName extends keyof ValidatorFactoryRegistry>(
  name: TName,
  factory: ValidatorFactoryRegistry[TName],
): void {
  validatorRegistry[name] = factory;
}

/**
 * A means of getting the validator factory registered at the provided name
 * @param name The name of the validator factory to retrieve.
 * @returns The validator factory.
 */
export function getValidatorFactory<
  TValidator extends keyof RegisteredValidators,
>(name: TValidator): ValidatorFactoryRegistry[TValidator] {
  return validatorRegistry[name];
}

/**
 * Creates a validator function using the provided configuration. The first
 * element in the configuration is the name of the registered validator. The
 * last element is the error message to display if the validator resolves to
 * `false`. All other elements in the configuration are arguments to the
 * validator factory.
 * @param config The configuration for instatiating the validator
 * @returns The validator function with provided args bound.
 */
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

/**
 * A type that represents a valid configuration for a registered component. The
 * elements in the tuple are:
 * 0. The type for which this configuration is valid. For example, if the
 *  configuration should only apply to `string` values, like a WYSIWYG editor,
 *  then the zeroth element should be the type `string`.
 * 1. The configuration options for this component. Consider extending
 *  ControlConfigurationBase
 * 2..n Valid configurations for children that are allowed to be nested within
 *  this component. If left unspecified, it's assumed the component does not
 *  support nesting children inside it (e.g., a text input or something)
 */
export type ComponentRegistration<
  Value,
  Config,
  Children extends ReadonlyArray<unknown> = [],
> = [Value, Config?, ...Children];

/**
 * For select lists, radio groups, etc., require specifying available options
 * as key-value pairs of { <optionValue>: <labelToDisplayForThatOption> }
 */
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
  [more: string]: ComponentRegistration<unknown, unknown, unknown[]>;
}

/**
 * This returns a union of the names of registered field controls.
 */
export type RegisteredComponents = KnownKeys<ComponentRegistry<never>>;

/**
 * This returns a union of the names of registered components that support the
 * specified data type.
 */
type ComponentsFor<Value> = keyof {
  [K in KnownKeys<
    ComponentRegistry<Value>
  > as Value extends ComponentRegistry<Value>[K][0] ? K : never]: K;
};

/**
 * The type(s) of configuration(s) valid for the specified `Value` and,
 * optionally, named `ComponentKey`
 */
export type Configuration<
  Value,
  ComponentKey extends ComponentsFor<Value> = ComponentsFor<Value>,
> = ComponentRegistry<Value>[ComponentKey] extends ComponentRegistration<
  unknown,
  infer ComponentConfiguration,
  infer ValidChildren
>
  ? IsPartial<ComponentConfiguration> extends true
    ? [ComponentKey, ComponentConfiguration?, ...ValidChildren]
    : [ComponentKey, ComponentConfiguration, ...ValidChildren]
  : never;

/**
 * The actual registry. Don't mess with it.
 */
const componentRegistry = new Map<RegisteredComponents, unknown>();

/**
 * The type(s) of configuration(s) for the specified `ComponentKey` and,
 * optionally, bound to type `Value`
 */
export type ConfigurationFor<
  ComponentKey extends RegisteredComponents,
  Value = never,
> = ComponentRegistry<Value>[ComponentKey] extends ComponentRegistration<
  unknown,
  infer ComponentConfiguration,
  infer ValidChildren
>
  ? IsPartial<ComponentConfiguration> extends true
    ? [ComponentKey, ComponentConfiguration?, ...ValidChildren]
    : [ComponentKey, ComponentConfiguration, ...ValidChildren]
  : never;

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
 * Gets the component's implementation from the registry.
 * @param key The string key of the registered component.
 * @returns The implmementation of the component.
 */
export function getComponentImplementation<Implementation>(
  key: RegisteredComponents,
): Implementation {
  return componentRegistry.get(key) as Implementation;
}

//#endregion components
