import { registerFieldControl } from '@fml/core';
import TOGGLE from '@fml/add/controls/toggle';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useId } from 'react';

type ToggleProps = FmlComponentProps<boolean>;

export default function Toggle({ formState }: ToggleProps) {
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
        onChange={(e) => setValue(e.target.checked)}
        onBlur={onBlur}
        onFocus={onFocus}
        defaultChecked={value}
      />
      <ValidationMessages validationMessages={validationMessages} />
    </>
  );
}

registerFieldControl(TOGGLE, Toggle);
