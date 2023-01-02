import { FmlFieldConfiguration, registerControl } from '@fml/core';
import CHECKBOX from '@fml/add/controls/checkbox';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

type CheckboxProps = FmlComponentProps<boolean>;

export default function Checkbox(props: CheckboxProps) {
  const { label } = props.config as FmlFieldConfiguration<boolean>;

  const {
    onBlur,
    onChange,
    controlId,
    onFocus,
    validationMessages,
    value,
    validity
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
        defaultChecked={value}
        onChange={(e) =>
          onChange({
            value: e.target.checked,
            validity: 'pending',
          })
        }
        onBlur={onBlur}
        onFocus={onFocus}
      />
      <ValidationMessages validationMessages={validationMessages} />
    </>
  );
}

registerControl(CHECKBOX, Checkbox);
