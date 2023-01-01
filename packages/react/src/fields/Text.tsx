import { FmlFieldConfiguration, registerControl } from '@fml/core';
import TEXT from '@fml/add/controls/text';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

type TextProps = FmlComponentProps<string>;

export default function Text(props: TextProps) {
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
      <input
        type='text'
        name={controlId}
        id={controlId}
        defaulValue={value.value}
        onChange={(e) =>
          changeHandler({
            value: e.target.value,
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

registerControl(TEXT, Text);
