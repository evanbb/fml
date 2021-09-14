import required from './required';
import { instantiateValidator } from '@fml/core';

it.each`
  value
  ${0}
  ${false}
  ${undefined}
  ${null}
  ${''}
`('returns false if $value is falsey', ({ value }) => {
  expect(required()(value)).toBe(false);
});

it.each`
  value
  ${1}
  ${true}
  ${{}}
  ${[]}
  ${'stuff'}
`('returns true if $value is truthy', ({ value }) => {
  expect(required()(value)).toBe(true);
});

it('is in the registry', () => {
  const validator = instantiateValidator(['required', '']);

  expect(validator).toBeDefined();
});
