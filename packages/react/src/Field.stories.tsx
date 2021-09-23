import '@fml/add/validators/required';
import Field from './Field';

export const CheckboxExample = () => (
  <Field<boolean>
    config={[
      'fml:checkbox',
      {
        label: 'A checkbox',
        validators: [['required', 'Check this, please']],
        defaultValue: false,
      },
    ]}
  />
);

export const DateExample = () => (
  <Field<Date | undefined>
    config={[
      'fml:date',
      {
        label: 'A date',
        defaultValue: undefined,
      },
    ]}
  />
);
export const DateTimeExample = () => (
  <Field<Date>
    config={[
      'fml:datetime',
      {
        label: 'A date',
        defaultValue: new Date(),
      },
    ]}
  />
);
export const HiddenExample = () => (
  <Field<string>
    config={[
      'fml:hidden',
      {
        label: 'A hidden value',
        defaultValue: '',
      },
    ]}
  />
);
export const NumberExample = () => (
  <Field<number>
    config={[
      'fml:number',
      {
        label: 'A number',
        validators: [['required', 'This is required, dawg']],
        defaultValue: undefined,
      },
    ]}
  />
);
export const SelectExample = () => (
  <Field<'a' | 'b' | 'c'>
    config={[
      'fml:select',
      {
        label: 'A few options',
        options: { a: 'Option A', b: 'Option B', c: 'Option C' },
        defaultValue: 'b',
      },
    ]}
  />
);
export const TextInputExample = () => (
  <Field<string>
    config={['fml:text', { label: 'Text input', defaultValue: '' }]}
  />
);
export const TextAreaInputExample = () => (
  <Field<string>
    config={['fml:textarea', { label: 'Text area', defaultValue: '' }]}
  />
);
export const ToggleExample = () => (
  <Field<boolean>
    config={['fml:toggle', { label: 'A checkbox', defaultValue: false }]}
  />
);

const stories = {
  title: 'Stories/Fml/Fields',
  component: Field,
};

export default stories;
