import { FmlFieldConfiguration } from '@fml/core';
import ValidationMessages from '../ValidationMessages';
import { useFmlComponent } from '../common/hooks';
import { FmlComponentProps } from '../common/FmlComponent';

type CheckboxProps = FmlComponentProps<boolean, FmlFieldConfiguration<boolean>>;

export default function Checkbox(props: CheckboxProps) {
  const {
    onChange,
    onFocus,
    onBlur,
    validationMessages,
    value: { validity },
  } = useFmlComponent<boolean>(props);

  const { label } = props.config;
  const { controlId } = props;

  return (
    <>
      <label data-fml-validity={validity} htmlFor={controlId}>
        {label}
      </label>
      <input
        type='checkbox'
        name={controlId}
        id={controlId}
        defaultChecked={props.config.defaultValue}
        onChange={(e) =>
          onChange({
            value: e.target.checked,
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
