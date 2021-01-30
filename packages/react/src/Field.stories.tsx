import Field from './Field';
import { FmlContextProvider } from './common/FmlContext';

function wrapInContext(element: React.ReactElement) {
  return (
    <FmlContextProvider value={{ currentFormPath: 'myField' }}>
      {element}
    </FmlContextProvider>
  );
}

export const CheckboxExample = () =>
  wrapInContext(
    <Field<boolean> config={{ label: 'A checkbox', control: 'checkbox' }} />,
  );
export const DateExample = () =>
  wrapInContext(<Field<Date> config={{ label: 'A date', control: 'date' }} />);
export const DateTimeExample = () =>
  wrapInContext(
    <Field<Date> config={{ label: 'A date', control: 'datetime' }} />,
  );
export const HiddenExample = () =>
  wrapInContext(
    <Field<string> config={{ label: 'A hidden value', control: 'hidden' }} />,
  );
export const NumberExample = () =>
  wrapInContext(
    <Field<number> config={{ label: 'A number', control: 'number' }} />,
  );
export const SelectExample = () =>
  wrapInContext(
    <Field<'a' | 'b' | 'c'>
      config={{
        label: 'A few options',
        control: 'select',
        options: { a: 'Option A', b: 'Option B', c: 'Option C' },
      }}
    />,
  );
export const TextInputExample = () =>
  wrapInContext(
    <Field<string> config={{ label: 'Text input', control: 'text' }} />,
  );
export const TextAreaInputExample = () =>
  wrapInContext(
    <Field<string> config={{ label: 'Text area', control: 'textarea' }} />,
  );
export const ToggleExample = () =>
  wrapInContext(
    <Field<boolean> config={{ label: 'A checkbox', control: 'toggle' }} />,
  );

export default {
  title: 'Stories/Fields',
  component: Field,
};
