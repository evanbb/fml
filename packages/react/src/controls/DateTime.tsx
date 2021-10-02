import { registerComponent } from '@fml/core';
import ValidationMessages from '../common/ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

const DATETIME = 'fml:datetime';

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [DATETIME]: [Date | undefined, ControlConfigurationBase<Date | undefined>];
  }
}

type DateTimeProps = FmlComponentProps<typeof DATETIME>;

export default function DateTime(props: DateTimeProps) {
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
        type='datetime-local'
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

registerComponent(DATETIME, DateTime);
