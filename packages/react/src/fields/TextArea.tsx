import { FmlFieldConfiguration, registerControl } from '@fml/core';
import TEXTAREA from '@fml/add/controls/textarea';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

type TextAreaProps = FmlComponentProps<string>;

export default function TextArea(props: TextAreaProps) {
  const { label } = props.config as FmlFieldConfiguration<string>;

  const {
    blurHandler,
    changeHandler,
    controlId,
    focusHandler,
    validationMessages,
    value,
  } = useFmlControl<string>(props.config as FmlFieldConfiguration<string>);

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
        defaulValue={value.value}
      ></textarea>
      <ValidationMessages validationMessages={validationMessages} />
    </>
  );
}

registerControl(TEXTAREA, TextArea);
