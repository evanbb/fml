import { FmlFieldConfiguration, registerControl } from '@fml/core';
import TEXT from '@fml/add/controls/text';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

type TextProps = FmlComponentProps<string>;

export default function Text(props: TextProps) {
  const { label } = props.config as FmlFieldConfiguration<string>;

  const {
    onBlur,
    onChange,
    controlId,
    onFocus,
    validationMessages,
    value,
    validity,
  } = useFmlControl<string>(props.config as FmlFieldConfiguration<string>);

  return (
    <>
      <label data-fml-validity={validity} htmlFor={controlId}>
        {label}
      </label>
      <input
        type='text'
        name={controlId}
        id={controlId}
        defaultValue={value}
        onChange={(e) =>
          onChange({
            value: e.target.value,
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

registerControl(TEXT, Text);
