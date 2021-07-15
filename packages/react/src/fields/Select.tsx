import { FmlFieldConfiguration } from '@fml/core';
import ValidationMessages from '../ValidationMessages';
import { useFmlComponent } from '../common/hooks';
import {
  FmlComponentProps,
  FmlFormComponentProps,
} from '../common/FmlComponent';

type SelectProps = FmlComponentProps<string, FmlFieldConfiguration<string>>;

export default function Select(props: SelectProps) {
  const {
    onChange,
    onFocus,
    onBlur,
    validationMessages,
    value: { validity },
  } = useFmlComponent<string>(
    props as unknown as FmlFormComponentProps<string>,
  );
  const { label, options } = (
    props as unknown as FmlFormComponentProps<'string'>
  ).config as FmlFieldConfiguration<'string'>;
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
}
