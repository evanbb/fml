import { FmlFieldConfiguration, registerControl } from '@fml/core';
import NUMBER from '@fml/add/controls/number';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

type NumberComponentProps = FmlComponentProps<number>;

export default function NumberComponent(props: NumberComponentProps) {
  const { label } = props.config as FmlFieldConfiguration<number>;

  const {
    onBlur,
    onChange,
    controlId,
    onFocus,
    validationMessages,
    value,
    validity,
  } = useFmlControl<number>(props.config as FmlFieldConfiguration<number>);

  return (
    <>
      <label data-fml-validity={validity} htmlFor={controlId}>
        {label}
      </label>
      <input
        type='number'
        name={controlId}
        id={controlId}
        defaultValue={value}
        onChange={(e) =>
          !isNaN(parseFloat(e.target.value)) &&
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

registerControl(NUMBER, NumberComponent);
