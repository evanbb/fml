import { registerFieldControl } from '@fml/core';
import DATETIME from '@fml/add/controls/datetime';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useId } from 'react';

type DateTimeProps = FmlComponentProps<Date>;

export default function DateTime({ formState }: DateTimeProps) {
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
        type='datetime-local'
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

registerFieldControl(DATETIME, DateTime);
