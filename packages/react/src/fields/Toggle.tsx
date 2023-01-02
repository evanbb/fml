import { FmlFieldConfiguration, registerControl } from '@fml/core';
import TOGGLE from '@fml/add/controls/toggle';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

type ToggleProps = FmlComponentProps<boolean>;

export default function Toggle(props: ToggleProps) {
  const { label } = props.config as FmlFieldConfiguration<boolean>;

  const {
    onBlur,
    onChange,
    controlId,
    onFocus,
    validationMessages,
    value,
    validity,
  } = useFmlControl<boolean>(props.config as FmlFieldConfiguration<boolean>);

  return (
    <>
      <label data-fml-validity={validity} htmlFor={controlId}>
        {label}
      </label>
      <input
        type='checkbox'
        name={controlId}
        id={controlId}
        onChange={(e) =>
          onChange({
            value: e.target.checked,
            validity: 'pending',
          })
        }
        onBlur={onBlur}
        onFocus={onFocus}
        defaultChecked={value}
      />
      <ValidationMessages validationMessages={validationMessages} />
    </>
  );
}

registerControl(TOGGLE, Toggle);
