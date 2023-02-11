import { registerFieldControl } from '@fml/core';
import DATE from '@fml/add/controls/date';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useId } from 'react';

type DateComponentProps = FmlComponentProps<Date>;

export default function DateComponent({ formState }: DateComponentProps) {
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
        type='date'
        name={id}
        id={id}
        defaultValue={value?.toString()}
        onChange={(e) => setValue(new Date(e.target.value))}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      <ValidationMessages validationMessages={validationMessages} />
    </>
  );
}

registerFieldControl(DATE, DateComponent);
