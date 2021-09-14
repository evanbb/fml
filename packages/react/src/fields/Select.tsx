import { FmlFieldConfiguration, registerControl } from '@fml/core';
import SELECT from '@fml/add/controls/select';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

type SelectProps = FmlComponentProps<string>;

export default function Select(props: SelectProps) {
  const { label, options } =
    props.config as unknown as FmlFieldConfiguration<'string'>;

    const {
      blurHandler,
      changeHandler,
      controlId,
      focusHandler,
      validationMessages,
      value,
    } = useFmlControl<'string'>(props.config as unknown as FmlFieldConfiguration<'string'>);
  
  return (
    <>
      <label data-fml-validity={value.validity} htmlFor={controlId}>
        {label}
      </label>
      <select
        name={controlId}
        id={controlId}
        defaultValue={value.value}
        onChange={(e) =>
          changeHandler({
            value: e.target.value as 'string',
            validity: 'pending',
          })
        }
        onBlur={blurHandler}
        onFocus={focusHandler}
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

registerControl(SELECT, Select);
