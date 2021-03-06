import { noop } from '@fml/core';
import Field from './Field';

function wrapInContext(element: React.ReactElement) {
  return element;
}

export const CheckboxExample = () => (
  <Field<boolean>
    controlId='test'
    onChange={noop}
    onFocus={noop}
    config={{
      label: 'A checkbox',
      control: 'checkbox',
      validators: [
        {
          message: 'Check this, please',
          validator: 'required',
        },
      ],
      defaultValue: false,
    }}
  />
);

export const DateExample = () =>
  wrapInContext(
    <Field<Date | undefined>
      controlId='test'
      onChange={noop}
      onFocus={noop}
      config={{
        label: 'A date',
        control: 'date',
        defaultValue: undefined,
      }}
    />,
  );
export const DateTimeExample = () =>
  wrapInContext(
    <Field<Date>
      controlId='test'
      onChange={noop}
      onFocus={noop}
      config={{
        label: 'A date',
        control: 'datetime',
        defaultValue: new Date(),
      }}
    />,
  );
export const HiddenExample = () =>
  wrapInContext(
    <Field<string>
      controlId='test'
      onChange={noop}
      onFocus={noop}
      config={{
        label: 'A hidden value',
        control: 'hidden',
        defaultValue: '',
      }}
    />,
  );
export const NumberExample = () =>
  wrapInContext(
    <Field<number>
      controlId='test'
      onChange={noop}
      onFocus={noop}
      config={{
        label: 'A number',
        control: 'number',
        validators: [
          { validator: 'required', message: 'This is required, dawg' },
        ],
        defaultValue: 0,
      }}
    />,
  );
export const SelectExample = () =>
  wrapInContext(
    <Field<'a' | 'b' | 'c'>
      controlId='test'
      onChange={noop}
      onFocus={noop}
      config={{
        label: 'A few options',
        control: 'select',
        options: { a: 'Option A', b: 'Option B', c: 'Option C' },
        defaultValue: 'b',
      }}
    />,
  );
export const TextInputExample = () =>
  wrapInContext(
    <Field<string>
      controlId='test'
      onChange={noop}
      onFocus={noop}
      config={{ label: 'Text input', control: 'text', defaultValue: '' }}
    />,
  );
export const TextAreaInputExample = () =>
  wrapInContext(
    <Field<string>
      controlId='test'
      onChange={noop}
      onFocus={noop}
      config={{ label: 'Text area', control: 'textarea', defaultValue: '' }}
    />,
  );
export const ToggleExample = () =>
  wrapInContext(
    <Field<boolean>
      controlId='test'
      onChange={noop}
      onFocus={noop}
      config={{ label: 'A checkbox', control: 'toggle', defaultValue: false }}
    />,
  );

const stories = {
  title: 'Stories/Fields',
  component: Field,
};

export default stories;
