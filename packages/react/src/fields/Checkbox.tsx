import { FieldConfiguration, registerControl } from '@fml/core';
import CHECKBOX from '@fml/add/controls/checkbox';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

type CheckboxProps = FmlComponentProps<boolean>;

export default function Checkbox(props: CheckboxProps) {
  const { label } = props.config as FieldConfiguration<boolean>;

  const {
    blurHandler,
    changeHandler,
    controlId,
    focusHandler,
    validationMessages,
    value,
  } = useFmlControl<boolean>(props.config as FieldConfiguration<boolean>);

  return (
    <>
      <label data-fml-validity={value.validity} htmlFor={controlId}>
        {label}
      </label>
      <input
        type='checkbox'
        name={controlId}
        id={controlId}
        defaultChecked={value.value}
        onChange={(e) =>
          changeHandler({
            value: e.target.checked,
            validity: 'pending',
          })
        }
        onBlur={blurHandler}
        onFocus={focusHandler}
      />
      <ValidationMessages validationMessages={validationMessages} />
    </>
  );
}

registerControl(CHECKBOX, Checkbox);
