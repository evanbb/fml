import { registerValidator, createValidator } from '../validators';

declare module '../../types/validators' {
  interface FmlValidatorRegistry {
    testValidator: FmlValidatorFactory<string, [requiredValue: string]>;
    anotherTest: FmlValidatorFactory;
  }
}

describe('registerValidator', () => {
  it('adds a custom validator to the registry', async () => {
    const validatorFactory = (requiredValue: string) => (value: string) =>
      value === requiredValue;
    const anotherValidatorFactory = () => () => false;

    registerValidator<string>()('testValidator', validatorFactory);
    registerValidator<unknown>()('anotherTest', anotherValidatorFactory);

    const validator = createValidator<string>({
      validator: 'testValidator',
      args: ['better be this'],
      message: 'Oops',
    });

    expect(await validator('better be this')).toBe(undefined);
    expect(await validator('it is not this')).toBe('Oops');

    const anotherValidator = createValidator<string>({
      validator: 'anotherTest',
      message: 'Dang',
    });

    expect(await anotherValidator('cannot be this')).toBe('Dang');
    expect(await anotherValidator('or even this')).toBe('Dang');
  });
});
