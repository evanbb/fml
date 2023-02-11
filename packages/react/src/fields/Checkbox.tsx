import { useId } from 'react';
import { registerFieldControl } from '@fml/core';
import CHECKBOX from '@fml/add/controls/checkbox';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';

type CheckboxProps = FmlComponentProps<boolean>;

export default function Checkbox({ formState }: CheckboxProps) {
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
      <input
        type='checkbox'
        name={id}
        id={id}
        defaultChecked={value}
        onChange={(e) => setValue(e.target.checked)}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      <ValidationMessages validationMessages={validationMessages} />
    </>
  );
}

registerFieldControl(CHECKBOX, Checkbox);
