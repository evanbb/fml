import { FmlFieldConfiguration } from '@fml/core';
import ValidationMessages from '../ValidationMessages';
import { useFmlComponent } from '../common/hooks';
import { FmlComponentProps } from '../common/FmlComponent';

type NumberComponentProps = FmlComponentProps<
  number,
  FmlFieldConfiguration<number>
>;

export default function NumberComponent(props: NumberComponentProps) {
  const {
    onChange,
    onFocus,
    onBlur,
    validationMessages,
    value: { validity },
  } = useFmlComponent<number>(props);
  const { label } = props.config;
  const { controlId } = props;

  return (
    <>
      <label data-fml-validity={validity} htmlFor={controlId}>
        {label}
      </label>
      <input
        type='number'
        name={controlId}
        id={controlId}
        defaultValue={props.config.defaultValue}
        onChange={(e) =>
          onChange({
            value: parseFloat(e.target.value),
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
