import { registerComponent } from '@fml/core';
import ValidationMessages from '../common/ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

const CHECKBOX = 'fml:checkbox'

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [CHECKBOX]: [boolean | undefined, ControlConfigurationBase<boolean | undefined>];
  }
}

type CheckboxProps = FmlComponentProps<typeof CHECKBOX>;

export default function Checkbox(props: CheckboxProps) {
  const [, { label }] = props.config;

  const {
    blurHandler,
    changeHandler,
    controlId,
    focusHandler,
    validationMessages,
    value,
  } = useFmlControl<boolean | undefined>(props.config[1]);

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

registerComponent(CHECKBOX, Checkbox);
