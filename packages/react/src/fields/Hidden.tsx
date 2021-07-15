import { FmlFieldConfiguration } from '@fml/core';
import { useFmlComponent } from '../common/hooks';
import { FmlComponentProps } from '../common/FmlComponent';

type HiddenProps = FmlComponentProps<string, FmlFieldConfiguration<string>>;

export default function Hidden(props: HiddenProps) {
  const {
    value: { value, validity },
  } = useFmlComponent<string>(props);
  const { controlId } = props;

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
