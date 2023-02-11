// import { registerFieldControl } from '@fml/core';
// import SELECT from '@fml/add/controls/select';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useId } from 'react';

type SelectProps = FmlComponentProps<string>;

export default function Select({ formState }: SelectProps) {
  const id = useId();
  const {
    bindings: { onBlur, onFocus, setValue },
    state: { label, validationMessages, validity },
    value,
  } = formState;

  return (
    <>
      <label data-fml-validity={validity} htmlFor={id}>
        {label}
      </label>
      <select
        name={id}
        id={id}
        defaultValue={value}
        onChange={(e) => setValue(e.target.value as 'string')}
        onBlur={onBlur}
        onFocus={onFocus}
      >
        {/* {Object.keys(options).map((k) => (
          <option key={k} value={k}>
            {options[k as keyof typeof options]}
          </option>
        ))} */}
      </select>
      <ValidationMessages validationMessages={validationMessages} />
    </>
  );
}

// registerFieldControl(SELECT, Select);
