import { FmlFieldConfiguration } from '@fml/core';
import ValidationMessages from '../ValidationMessages';
import { useFmlComponent } from '../common/hooks';
import { FmlComponentProps } from '../common/FmlComponent';

type DateComponentProps = FmlComponentProps<Date, FmlFieldConfiguration<Date>>;

export default function DateComponent(props: DateComponentProps) {
  const {
    onChange,
    onFocus,
    onBlur,
    validationMessages,
    value: { validity },
  } = useFmlComponent<Date>(props);
  const { label } = props.config;
  const { controlId } = props;

  return (
    <>
      <label data-fml-validity={validity} htmlFor={controlId}>
        {label}
      </label>
      <input
        type='date'
        name={controlId}
        id={controlId}
        defaultValue={props.config.defaultValue?.toString()}
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
