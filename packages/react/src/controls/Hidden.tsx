import { registerComponent } from '@fml/core';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

const HIDDEN = 'fml:hidden';

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [HIDDEN]: [
      StringOnlyNotStringUnion<Value> | undefined,
      ControlConfigurationBase<StringOnlyNotStringUnion<Value> | undefined>,
    ];
  }
}

type HiddenProps = FmlComponentProps<typeof HIDDEN, string>;

export default function Hidden(props: HiddenProps) {
  const { controlId, value } = useFmlControl<string | undefined>(
    props.config[1],
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

registerComponent(HIDDEN, Hidden);
