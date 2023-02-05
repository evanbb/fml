import { FmlControlValidator, FmlRegisteredValidators, FmlValidator, FmlValidatorConfiguration, FmlValidatorFactoryRegistry } from '../index';

export function instantiateValidator<Value>(
  config: FmlValidatorConfiguration<Value>,
): FmlControlValidator<Value> {
  // get the appropriate validator factory for this data type
  const type = config[0];
  const factory = getValidatorFactory(type);

  const args = (config as unknown[]).slice(1, (config as unknown[]).length - 1);

  // create the validator function by applying the factory
  const func = (factory as (...x: unknown[]) => unknown)(
    ...args,
  ) as FmlValidator<Value>;

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

/**
 * A means of getting the validator factory registered at the provided name
 * @param name The name of the validator factory to retrieve
 * @returns The validator factory
 */
export function getValidatorFactory<Validator extends keyof FmlRegisteredValidators>(
  name: Validator,
): FmlValidatorFactoryRegistry[Validator] {
  return validatorRegistry[name];
}

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
  ValidatorKey extends keyof FmlValidatorFactoryRegistry,
>(key: ValidatorKey, factory: FmlValidatorFactoryRegistry[ValidatorKey]): void {
  validatorRegistry[key] = factory;
}
