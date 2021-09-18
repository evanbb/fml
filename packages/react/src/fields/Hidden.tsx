import { ControlConfiguration, registerControl } from '@fml/core';
import HIDDEN from '@fml/add/controls/hidden';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

type HiddenProps = FmlComponentProps<string>;

export default function Hidden(props: HiddenProps) {
  const { controlId, value } = useFmlControl<string>(
    props.config as ControlConfiguration<string>,
  );

  return (
    <input
      data-fml-validity={value.validity}
      type='hidden'
      name={controlId}
      id={controlId}
      value={value.value}
    />
  );
}

registerControl(HIDDEN, Hidden);
