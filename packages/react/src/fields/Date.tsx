import { registerComponent } from '@fml/core';
import DATE from '@fml/add/controls/date';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

type DateComponentProps = FmlComponentProps<'fml:date'>;

export default function DateComponent(props: DateComponentProps) {
  const [, { label }] = props.config;

  const {
    blurHandler,
    changeHandler,
    controlId,
    focusHandler,
    validationMessages,
    value,
  } = useFmlControl<Date>(props.config);

  return (
    <>
      <label data-fml-validity={value.validity} htmlFor={controlId}>
        {label}
      </label>
      <input
        type='date'
        name={controlId}
        id={controlId}
        defaultValue={value.value?.toString()}
        onChange={(e) =>
          changeHandler({
            value: new Date(e.target.value),
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

registerComponent(DATE, DateComponent);
