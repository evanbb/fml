import '@fml/add/validators/required'
import Field from './Field';

// export const CheckboxExample = () => (
//   <Field<boolean>
//     config={{
//       label: 'A checkbox',
//       control: 'checkbox',
//       validators: [['required', 'Check this, please']],
//       defaultValue: false,
//     }}
//   />
// );

// export const DateExample = () => (
//   <Field<Date | undefined>
//     config={{
//       label: 'A date',
//       control: 'date',
//       defaultValue: undefined,
//     }}
//   />
// );
// export const DateTimeExample = () => (
//   <Field<Date>
//     config={{
//       label: 'A date',
//       control: 'datetime',
//       defaultValue: new Date(),
//     }}
//   />
// );
// export const HiddenExample = () => (
//   <Field<string>
//     config={{
//       label: 'A hidden value',
//       control: 'hidden',
//       defaultValue: '',
//     }}
//   />
// );
// export const NumberExample = () => (
//   <Field<number>
//     config={{
//       label: 'A number',
//       control: 'number',
//       validators: [['required', 'This is required, dawg']],
//       defaultValue: undefined,
//     }}
//   />
// );
// export const SelectExample = () => (
//   <Field<'a' | 'b' | 'c'>
//     config={{
//       label: 'A few options',
//       control: 'select',
//       options: { a: 'Option A', b: 'Option B', c: 'Option C' },
//       defaultValue: 'b',
//     }}
//   />
// );
// export const TextInputExample = () => (
//   <Field<string>
//     config={{ label: 'Text input', control: 'text', defaultValue: '' }}
//   />
// );
// export const TextAreaInputExample = () => (
//   <Field<string>
//     config={{ label: 'Text area', control: 'textarea', defaultValue: '' }}
//   />
// );
// export const ToggleExample = () => (
//   <Field<boolean>
//     config={{ label: 'A checkbox', control: 'toggle', defaultValue: false }}
//   />
// );

const stories = {
  title: 'Stories/Fml/Fields',
  component: Field,
};

export default stories;
