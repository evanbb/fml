import { FmlFieldConfiguration } from '@fml/core';
import ValidationMessages from '../ValidationMessages';
import { useFmlComponent } from '../common/hooks';
import { FmlComponentProps } from '../common/FmlComponent';

type TextAreaProps = FmlComponentProps<string, FmlFieldConfiguration<string>>;

export default function TextArea(props: TextAreaProps) {
  const {
    onChange,
    onFocus,
    onBlur,
    validationMessages,
    value: { validity },
  } = useFmlComponent<string>(props);

  const { label } = props.config;
  const { controlId } = props;

  return (
    <>
      <label data-fml-validity={validity} htmlFor={controlId}>
        {label}
      </label>
      <textarea
        name={controlId}
        id={controlId}
        onChange={(e) =>
          onChange({
            value: e.target.value,
            validity: 'pending',
          })
        }
        onBlur={onBlur}
        onFocus={onFocus}
        defaultValue={props.config.defaultValue}
      ></textarea>
      <ValidationMessages validationMessages={validationMessages} />
    </>
  );
}
