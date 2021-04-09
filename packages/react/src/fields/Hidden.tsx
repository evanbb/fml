import { FmlControlConfiguration } from '@fml/core';
import HIDDEN from '@fml/core/controls/add/hidden';
import { register } from '@fml/core/controls';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

type HiddenProps = FmlComponentProps<string>;

export default function Hidden(props: HiddenProps) {
  const { controlId, value } = useFmlControl<string>(
    props.config as FmlControlConfiguration<string>,
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

register(HIDDEN, Hidden);
