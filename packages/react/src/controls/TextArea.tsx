import { registerComponent } from '@fml/core';
import ValidationMessages from '../common/ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

const TEXTAREA = 'fml:textarea';

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [TEXTAREA]: [
      StringOnlyNotStringUnion<Value> | undefined,
      ControlConfigurationBase<StringOnlyNotStringUnion<Value> | undefined>,
    ];
  }
}

type TextAreaProps = FmlComponentProps<typeof TEXTAREA, string>;

export default function TextArea(props: TextAreaProps) {
  const [, { label }] = props.config;

  const {
    blurHandler,
    changeHandler,
    controlId,
    focusHandler,
    validationMessages,
    value,
  } = useFmlControl<string | undefined>(props.config[1]);

  return (
    <>
      <label data-fml-validity={value.validity} htmlFor={controlId}>
        {label}
      </label>
      <textarea
        name={controlId}
        id={controlId}
        onChange={(e) =>
          changeHandler({
            value: e.target.value,
            validity: 'pending',
          })
        }
        onBlur={blurHandler}
        onFocus={focusHandler}
        defaultValue={value.value}
      ></textarea>
      <ValidationMessages validationMessages={validationMessages} />
    </>
  );
}

registerComponent(TEXTAREA, TextArea);
