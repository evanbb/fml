# @fml/validators

## What are they?

Validators are what you probably think they are: they are functions responsible
for validating pieces of form data.

Validators have the following signature:

```ts
<TValue>(value: TValue) => boolean | Promise<boolean>
```

## How do I get them?

A validator is identified by its unique name, such as `'required'` or
`'minLength'`.

Validator functions are created by invoking a factory function to bind any
requried parameters:

```ts
// inside '@fml/validators', these functions exist:

// this factory needs consumer code to provide the required minimum length
function minLengthFactory(minLength: number) {
    return function minLength(value: { length: number }) {
        return value.length > minLength;
    }
}

// this factory doesn't need any arguments
function requiredFactory() {
    return function required(value: unknown) {
        return Boolean(value);
    }
}
```

```ts
// in your code, you can do the following:
import { getValidator } from '@fml/validators'

const minLengthFactory = getValidator('minLength')
```

## Defining custom validators

Validator factories are stored in an extensible registry so consumers can
register new, custom validators:

```ts
import { FmlValidatorFactory, register } from '@fml/validators'

// augment the '@fml/validators' module to add yours to the registry
declare module '@fml/validators' {
    export interface FmlValidatorFactoryRegistry {
        foo: FmlValidatorFactory<
            // the data type you want to validate
            Foo, 
            // the arguments to bind to your validator
            [
                Bar
            ]
        >
    }
}

// then, declare your factory
const foo: FmlRegisteredValidators['foo'] = function foo(bar) {
  return bar.baz?.qux;
};

// register it so it is available at runtime
register('foo', foo);

// be sure to export it so you can test your code!
export default foo;
```
