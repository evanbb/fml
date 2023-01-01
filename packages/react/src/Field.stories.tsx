import '@fml/add/validators/required'
import Field from './Field';

export const CheckboxExample = () => (
  <Field<boolean>
    config={{
      label: 'A checkbox',
      control: 'checkbox',
      validators: [['required', 'Check this, please']],
      defaulValue: false,
    }}
  />
);

export const DateExample = () => (
  <Field<Date | undefined>
    config={{
      label: 'A date',
      control: 'date',
      defaulValue: undefined,
    }}
  />
);
export const DateTimeExample = () => (
  <Field<Date>
    config={{
      label: 'A date',
      control: 'datetime',
      defaulValue: new Date(),
    }}
  />
);
export const HiddenExample = () => (
  <Field<string>
    config={{
      label: 'A hidden value',
      control: 'hidden',
      defaulValue: '',
    }}
  />
);
export const NumberExample = () => (
  <Field<number>
    config={{
      label: 'A number',
      control: 'number',
      validators: [['required', 'This is required, dawg']],
      defaulValue: undefined,
    }}
  />
);
export const SelectExample = () => (
  <Field<'a' | 'b' | 'c'>
    config={{
      label: 'A few options',
      control: 'select',
      options: { a: 'Option A', b: 'Option B', c: 'Option C' },
      defaulValue: 'b',
    }}
  />
);
export const TextInputExample = () => (
  <Field<string>
    config={{ label: 'Text input', control: 'text', defaulValue: '' }}
  />
);
export const TextAreaInputExample = () => (
  <Field<string>
    config={{ label: 'Text area', control: 'textarea', defaulValue: '' }}
  />
);
export const ToggleExample = () => (
  <Field<boolean>
    config={{ label: 'A checkbox', control: 'toggle', defaulValue: false }}
  />
);

const stories = {
  title: 'Stories/Fml/Fields',
  component: Field,
};

export default stories;
