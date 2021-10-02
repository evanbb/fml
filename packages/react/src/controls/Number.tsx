import { registerComponent } from '@fml/core';
import ValidationMessages from '../common/ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

const NUMBER = 'fml:number';

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [NUMBER]: [
      number | undefined,
      ControlConfigurationBase<number | undefined>,
    ];
  }
}

type NumberComponentProps = FmlComponentProps<typeof NUMBER>;

export default function NumberComponent(props: NumberComponentProps) {
  const [, { label }] = props.config;

  const {
    blurHandler,
    changeHandler,
    controlId,
    focusHandler,
    validationMessages,
    value,
  } = useFmlControl<number | undefined>(props.config[1]);

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
