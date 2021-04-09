import { KnownKeys } from '../utils';

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
const registry = {} as FmlValidatorFactoryRegistry;

/**
 * Registers the provided validator factory implementation at the provided name.
 * @param name The name of the validator to enter into the registry
 * @param factory The validator factory implementation
 */
export function register<TName extends keyof FmlValidatorFactoryRegistry>(
  name: TName,
  factory: FmlValidatorFactoryRegistry[TName],
): void {
  registry[name] = factory;
}

/**
 * A means of getting the validator factory registered at the provided name
 * @param name The name of the validator factory to retrieve
 * @returns The validator factory
 */
export function getFactory<TValidator extends keyof FmlRegisteredValidators>(
  name: TValidator,
): FmlValidatorFactoryRegistry[TValidator] {
  return registry[name];
}
