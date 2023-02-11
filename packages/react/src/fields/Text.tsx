import { registerFieldControl } from '@fml/core';
import TEXT from '@fml/add/controls/text';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useId } from 'react';

type TextProps = FmlComponentProps<string>;

export default function Text({ formState }: TextProps) {
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
        type='text'
        name={id}
        id={id}
        defaultValue={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      <ValidationMessages validationMessages={validationMessages} />
    </>
  );
}

registerFieldControl(TEXT, Text);
