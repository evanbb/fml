import { FmlFieldConfiguration, registerControl } from '@fml/core';
import DATETIME from '@fml/add/controls/datetime';
import ValidationMessages from '../ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

type DateTimeProps = FmlComponentProps<Date>;

export default function DateTime(props: DateTimeProps) {
  const { label } = props.config as FmlFieldConfiguration<Date>;

  const {
    onBlur,
    onChange,
    controlId,
    onFocus,
    validationMessages,
    value,
    validity,
  } = useFmlControl<Date>(props.config as FmlFieldConfiguration<Date>);

  return (
    <>
      <label data-fml-validity={validity} htmlFor={controlId}>
        {label}
      </label>
      <input
        type='datetime-local'
        name={controlId}
        id={controlId}
        defaultValue={value?.toString()}
        onChange={(e) =>
          onChange({
            value: new Date(e.target.value),
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

registerControl(DATETIME, DateTime);
