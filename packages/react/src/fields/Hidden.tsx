import { registerComponent } from '@fml/core';
import HIDDEN from '@fml/add/controls/hidden';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

type HiddenProps = FmlComponentProps<'fml:hidden'>;

export default function Hidden(props: HiddenProps) {
  const { controlId, value } = useFmlControl<string>(props.config);

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

registerComponent(HIDDEN, Hidden);
