import { registerComponent } from '@fml/core';
import TEXTAREA from '@fml/add/controls/textarea';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

type TextAreaProps = FmlComponentProps<'fml:textarea', string>;

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
