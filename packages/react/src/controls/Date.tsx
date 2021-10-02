import { registerComponent } from '@fml/core';
import ValidationMessages from '../common/ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

const DATE = 'fml:date'

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [DATE]: [Date | undefined, ControlConfigurationBase<Date | undefined>];
  }
}

type DateComponentProps = FmlComponentProps<typeof DATE>;

export default function DateComponent(props: DateComponentProps) {
  const [, { label }] = props.config;

  const {
    blurHandler,
    changeHandler,
    controlId,
    focusHandler,
    validationMessages,
    value,
  } = useFmlControl<Date | undefined>(props.config[1]);

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
