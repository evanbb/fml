import {
  FmlControlDataType,
  FmlFieldConfiguration,
  FmlFieldConfigurationForControl,
} from '@fml/core';
import { memo } from 'react';
import {
  FmlComponentProps,
  FmlFormComponentProps,
} from './common/FmlComponent';
import { useFmlComponent } from './common/hooks';
import ValidationMessages from './ValidationMessages';

export type FieldMap<TValue> = {
  [Key in keyof FmlControlDataType<TValue> as Capitalize<Key>]: React.ComponentType<
    {
      config: FmlFieldConfigurationForControl<TValue, Key>;
    } & FmlComponentProps<
      FmlControlDataType<TValue>[Key],
      FmlFieldConfiguration<FmlControlDataType<TValue>[Key]>
    >
  >;
};

function getControl<TValue>(
  props: FmlComponentProps<TValue, FmlFieldConfiguration<TValue>>,
): React.ComponentType<
  FmlComponentProps<TValue, FmlFieldConfiguration<TValue>>
> {
  const map: FieldMap<TValue> = {
    Checkbox: (props) => {
      const {
        onChange,
        onFocus,
        onBlur,
        validationMessages,
        value: { validity },
      } = useFmlComponent<boolean>(props);

      const { label } = props.config;
      const { controlId } = props;
      

      return (
        <>
          <label data-fml-validity={validity} htmlFor={controlId}>
            {label}
          </label>
          <input
            type='checkbox'
            name={controlId}
            id={controlId}
            defaultChecked={props.config.defaultValue}
            onChange={(e) =>
              onChange({
                value: e.target.checked,
                validity: 'pending',
              })
            }
            onBlur={onBlur}
            onFocus={onFocus}
          />
          <ValidationMessages validationMessages={validationMessages} />
        </>
      );
    },
    Date: (props) => {
      const {
        onChange,
        onFocus,
        onBlur,
        validationMessages,
        value: { validity },
      } = useFmlComponent<Date>(props);
      const { label } = props.config;
      const { controlId } = props;
      
      return (
        <>
          <label data-fml-validity={validity} htmlFor={controlId}>
            {label}
          </label>
          <input
            type='date'
            name={controlId}
            id={controlId}
            defaultValue={props.config.defaultValue?.toString()}
            onChange={(e) =>
              onChange({
                value: new Date(e.target.value),
                validity: 'pending',
              })
            }
            onBlur={onBlur}
            onFocus={onFocus}
          />
          <ValidationMessages validationMessages={validationMessages} />
        </>
      );
    },
    Datetime: (props) => {
      const {
        onChange,
        onFocus,
        onBlur,
        validationMessages,
        value: { validity },
      } = useFmlComponent<Date>(props);
      const { label } = props.config;
      const { controlId } = props;
      
      return (
        <>
          <label data-fml-validity={validity} htmlFor={controlId}>
            {label}
          </label>
          <input
            type='datetime-local'
            name={controlId}
            id={controlId}
            defaultValue={props.config.defaultValue?.toString()}
            onChange={(e) =>
              onChange({
                value: new Date(e.target.value),
                validity: 'pending',
              })
            }
            onBlur={onBlur}
            onFocus={onFocus}
          />
          <ValidationMessages validationMessages={validationMessages} />
        </>
      );
    },
    Hidden: (props) => {
      const {
        value: { value, validity },
      } = useFmlComponent<string>(props);
      const { controlId } = props;
      
      return (
        <input
          data-fml-validity={validity}
          type='hidden'
          name={controlId}
          id={controlId}
          value={value}
        />
      );
    },
    Number: (props) => {
      const {
        onChange,
        onFocus,
        onBlur,
        validationMessages,
        value: { validity },
      } = useFmlComponent<number>(props);
      const { label } = props.config;
      const { controlId } = props;
      
      return (
        <>
          <label data-fml-validity={validity} htmlFor={controlId}>
            {label}
          </label>
          <input
            type='number'
            name={controlId}
            id={controlId}
            defaultValue={props.config.defaultValue}
            onChange={(e) =>
              onChange({
                value: parseFloat(e.target.value),
                validity: 'pending',
              })
            }
            onBlur={onBlur}
            onFocus={onFocus}
          />
          <ValidationMessages validationMessages={validationMessages} />
        </>
      );
    },
    Select: (props) => {
      const {
        onChange,
        onFocus,
        onBlur,
        validationMessages,
        value: { validity },
      } = useFmlComponent<string>(
        (props as unknown) as FmlFormComponentProps<string>,
      );
      const { label, options } = props.config;
      const { controlId } = props;
      
      return (
        <>
          <label data-fml-validity={validity} htmlFor={controlId}>
            {label}
          </label>
          <select
            name={controlId}
            id={controlId}
            defaultValue={props.config.defaultValue}
            onChange={(e) =>
              onChange({
                value: e.target.value,
                validity: 'pending',
              })
            }
            onBlur={onBlur}
            onFocus={onFocus}
          >
            {Object.keys(options).map((k) => (
              <option key={k} value={k}>
                {options[k as keyof typeof options]}
              </option>
            ))}
          </select>
          <ValidationMessages validationMessages={validationMessages} />
        </>
      );
    },
    Text: (props) => {
      const {
        onChange,
        onFocus,
        onBlur,
        validationMessages,
        value: { validity },
      } = useFmlComponent<string>(props);
      const { label } = props.config;
      const { controlId } = props;
      
      return (
        <>
          <label data-fml-validity={validity} htmlFor={controlId}>
            {label}
          </label>
          <input
            type='text'
            name={controlId}
            id={controlId}
            defaultValue={props.config.defaultValue}
            onChange={(e) =>
              onChange({
                value: e.target.value,
                validity: 'pending',
              })
            }
            onBlur={onBlur}
            onFocus={onFocus}
          />
          <ValidationMessages validationMessages={validationMessages} />
        </>
      );
    },
    Textarea: (props) => {
      const {
        onChange,
        onFocus,
        onBlur,
        validationMessages,
        value: { validity },
      } = useFmlComponent<string>(props);

      const { label } = props.config;
      const { controlId } = props;
      

      return (
        <>
          <label data-fml-validity={validity} htmlFor={controlId}>
            {label}
          </label>
          <textarea
            name={controlId}
            id={controlId}
            onChange={(e) =>
              onChange({
                value: e.target.value,
                validity: 'pending',
              })
            }
            onBlur={onBlur}
            onFocus={onFocus}
            defaultValue={props.config.defaultValue}
          ></textarea>
          <ValidationMessages validationMessages={validationMessages} />
        </>
      );
    },
    Toggle: (props) => {
      const {
        onChange,
        onFocus,
        onBlur,
        validationMessages,
        value: { validity },
      } = useFmlComponent<boolean>(props);

      const { label } = props.config;
      const { controlId } = props;

      

      return (
        <>
          <label data-fml-validity={validity} htmlFor={controlId}>
            {label}
          </label>
          <input
            type='checkbox'
            name={controlId}
            id={controlId}
            onChange={(e) =>
              onChange({
                value: e.target.checked,
                validity: 'pending',
              })
            }
            onBlur={onBlur}
            onFocus={onFocus}
            defaultChecked={props.config.defaultValue}
          />
          <ValidationMessages validationMessages={validationMessages} />
        </>
      );
    },
  };

  const { control } = props.config;
  const capitalized = `${control
    .substring(0, 1)
    .toUpperCase()}${control.substring(1)}` as Capitalize<keyof typeof map>;

  const result = map[capitalized];

  return (result as unknown) as React.ComponentType<
    FmlComponentProps<TValue, FmlFieldConfiguration<TValue>>
  >;
}

function Field<TValue>(
  props: FmlComponentProps<TValue, FmlFieldConfiguration<TValue>>,
) {
  const Ctrl = getControl<TValue>(props);

  return <Ctrl key={props.controlId} {...props} />;
}

export default memo(Field) as typeof Field;
