import { registerFieldControl } from '@fml/core';
import TEXTAREA from '@fml/add/controls/textarea';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useId } from 'react';

type TextAreaProps = FmlComponentProps<string>;

export default function TextArea({ formState }: TextAreaProps) {
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
      <textarea
        name={id}
        id={id}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        defaultValue={value}
      ></textarea>
      <ValidationMessages validationMessages={validationMessages} />
    </>
  );
}

registerFieldControl(TEXTAREA, TextArea);
