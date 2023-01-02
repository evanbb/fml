import { FmlControlConfiguration, registerControl } from '@fml/core';
import HIDDEN from '@fml/add/controls/hidden';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

type HiddenProps = FmlComponentProps<string>;

export default function Hidden(props: HiddenProps) {
  const { controlId, value, validity } = useFmlControl<string>(
    props.config as FmlControlConfiguration<string>,
  );

  return (
    <input
      data-fml-validity={validity}
      type='hidden'
      name={controlId}
      id={controlId}
      value={value}
    />
  );
}

registerControl(HIDDEN, Hidden);
