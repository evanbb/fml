import { registerComponent } from '@fml/core';
import NUMBER from '@fml/add/controls/number';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

type NumberComponentProps = FmlComponentProps<'fml:number'>;

export default function NumberComponent(props: NumberComponentProps) {
  const [, { label }] = props.config;

  const {
    blurHandler,
    changeHandler,
    controlId,
    focusHandler,
    validationMessages,
    value,
  } = useFmlControl<number>(props.config);

  return (
    <>
      <label data-fml-validity={value.validity} htmlFor={controlId}>
        {label}
      </label>
      <input
        type='number'
        name={controlId}
        id={controlId}
        defaultValue={value.value}
        onChange={(e) =>
          !isNaN(parseFloat(e.target.value)) &&
          changeHandler({
            value: parseFloat(e.target.value),
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

registerComponent(NUMBER, NumberComponent);
