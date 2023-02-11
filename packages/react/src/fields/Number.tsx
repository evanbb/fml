import { registerFieldControl } from '@fml/core';
import NUMBER from '@fml/add/controls/number';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useId } from 'react';

type NumberComponentProps = FmlComponentProps<number>;

export default function NumberComponent({ formState }: NumberComponentProps) {
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
        type='number'
        name={id}
        id={id}
        defaultValue={value}
        onChange={(e) =>
          !isNaN(parseFloat(e.target.value)) &&
          setValue(parseFloat(e.target.value))
        }
        onBlur={onBlur}
        onFocus={onFocus}
      />
      <ValidationMessages validationMessages={validationMessages} />
    </>
  );
}

registerFieldControl(NUMBER, NumberComponent);
