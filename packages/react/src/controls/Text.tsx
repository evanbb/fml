import { registerComponent } from '@fml/core';
import ValidationMessages from '../common/ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

const TEXT = 'fml:text';

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [TEXT]: [
      StringOnlyNotStringUnion<Value> | undefined,
      ControlConfigurationBase<StringOnlyNotStringUnion<Value> | undefined>,
    ];
  }
}

type TextProps = FmlComponentProps<typeof TEXT, string>;

export default function Text(props: TextProps) {
  const [, { label }] = props.config;

  const {
    blurHandler,
    changeHandler,
    controlId,
    focusHandler,
    validationMessages,
    value,
  } = useFmlControl<string | undefined>(props.config[1]);

  return (
    <>
      <label data-fml-validity={value.validity} htmlFor={controlId}>
        {label}
      </label>
      <input
        type='text'
        name={controlId}
        id={controlId}
        defaultValue={value.value}
        onChange={(e) => {
          changeHandler({
            value: e.target.value,
            validity: 'pending',
          });
        }}
        onBlur={blurHandler}
        onFocus={focusHandler}
      />
      <ValidationMessages validationMessages={validationMessages} />
    </>
  );
}

registerComponent(TEXT, Text);
