import { registerComponent } from '@fml/core';
import ValidationMessages from '../common/ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

const TOGGLE = 'fml:toggle'

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [TOGGLE]: [boolean | undefined, ControlConfigurationBase<boolean | undefined>];
  }
}

type ToggleProps = FmlComponentProps<typeof TOGGLE>;

export default function Toggle(props: ToggleProps) {
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
        onChange={(e) =>
          changeHandler({
            value: e.target.checked,
            validity: 'pending',
          })
        }
        onBlur={blurHandler}
        onFocus={focusHandler}
        defaultChecked={value.value}
      />
      <ValidationMessages validationMessages={validationMessages} />
    </>
  );
}

registerComponent(TOGGLE, Toggle);
