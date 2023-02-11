import { registerFieldControl } from '@fml/core';
import HIDDEN from '@fml/add/controls/hidden';
import { FmlComponentProps } from '../common/FmlComponent';
import { useId } from 'react';

type HiddenProps = FmlComponentProps<string>;

export default function Hidden({ formState }: HiddenProps) {
  const id = useId();
  const {
    state: { validity },
    value,
  } = formState;

  return (
    <input
      data-fml-validity={validity}
      type='hidden'
      name={id}
      id={id}
      value={value}
    />
  );
}

registerFieldControl(HIDDEN, Hidden);
