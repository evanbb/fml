import { FmlFieldConfiguration } from '@fml/core';
import CHECKBOX from '@fml/core/controls/add/checkbox';
import { register } from '@fml/core/controls';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

type CheckboxProps = FmlComponentProps<boolean>;

export default function Checkbox(props: CheckboxProps) {
  const { label } = props.config as FmlFieldConfiguration<boolean>;

  const {
    blurHandler,
    changeHandler,
    controlId,
    focusHandler,
    validationMessages,
    value,
  } = useFmlControl<boolean>(props.config as FmlFieldConfiguration<boolean>);

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

register(CHECKBOX, Checkbox);
