import {
  ControlDataType,
  FieldConfiguration,
  FieldConfigurationForControl,
} from '@evanbb/fml-core';
import { useFmlContext } from './common/FmlContext';

interface FieldProps<TValue> {
  config: FieldConfiguration<TValue>;
}

type FieldMap<TValue> = {
  [Key in keyof ControlDataType<TValue>]: React.ComponentType<{
    config: FieldConfigurationForControl<TValue, Key>;
  }>;
};

function getControl<TValue>(
  config: FieldConfiguration<TValue>,
): React.ComponentType<FieldProps<TValue>> {
  const map: FieldMap<TValue> = {
    checkbox: ({ config: { label } }) => {
      const context = useFmlContext();
      const fieldId = context.currentFormPath;
      return (
        <>
          <label htmlFor={fieldId}>{label}:</label>
          <input type='checkbox' name={fieldId} id={fieldId} />
        </>
      );
    },
    date: ({ config: { label } }) => {
      const context = useFmlContext();
      const fieldId = context.currentFormPath;
      return (
        <>
          <label htmlFor={fieldId}>{label}:</label>
          <input type='date' name={fieldId} id={fieldId} />
        </>
      );
    },
    datetime: ({ config: { label } }) => {
      const context = useFmlContext();
      const fieldId = context.currentFormPath;
      return (
        <>
          <label htmlFor={fieldId}>{label}: </label>
          <input type='datetime-local' name={fieldId} id={fieldId} />
        </>
      );
    },
    hidden: () => {
      const context = useFmlContext();
      const fieldId = context.currentFormPath;
      return <input type='hidden' name={fieldId} id={fieldId} />;
    },
    number: ({ config: { label } }) => {
      const context = useFmlContext();
      const fieldId = context.currentFormPath;
      return (
        <>
          <label htmlFor={fieldId}>{label}:</label>
          <input type='number' name={fieldId} id={fieldId} />
        </>
      );
    },
    select: ({ config: { label, options } }) => {
      const context = useFmlContext();
      const fieldId = context.currentFormPath;
      return (
        <>
          <label htmlFor={fieldId}>{label}:</label>
          <select name={fieldId} id={fieldId}>
            {Object.keys(options).map((k) => (
              <option key={k} value={k}>
                {options[k as keyof typeof options]}
              </option>
            ))}
          </select>
        </>
      );
    },
    text: ({ config: { label } }) => {
      const context = useFmlContext();
      const fieldId = context.currentFormPath;
      return (
        <>
          <label htmlFor={fieldId}>{label}:</label>
          <input name={fieldId} id={fieldId} />
        </>
      );
    },
    textarea: ({ config: { label } }) => {
      const context = useFmlContext();
      const fieldId = context.currentFormPath;
      return (
        <>
          <label htmlFor={fieldId}>{label}:</label>
          <textarea name={fieldId} id={fieldId}></textarea>
        </>
      );
    },
    toggle: ({ config: { label } }) => <>a toggle</>,
  };

  const result = map[config.control];

  return (result as unknown) as React.ComponentType<FieldProps<TValue>>;
}

export default function Field<TValue>({ config }: FieldProps<TValue>) {
  const Ctrl = getControl<TValue>(config);

  return <Ctrl config={config} />;
}
