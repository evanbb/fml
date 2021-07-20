import { FmlFieldConfiguration } from '@fml/core';
import ValidationMessages from '../ValidationMessages';
import { useFmlComponent } from '../common/hooks';
import { FmlComponentProps } from '../common/FmlComponent';
import { register } from '@fml/controls';

type TextProps = FmlComponentProps<string, FmlFieldConfiguration<string>>;

export default function Text(props: TextProps) {
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
      <input
        type='text'
        name={controlId}
        id={controlId}
        defaultValue={props.config.defaultValue}
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

register('text', Text);
