import { Configuration, registerComponent } from '@fml/core';
import ValidationMessages from '../common/ValidationMessages';
import { FmlComponentProps } from '../common/FmlComponent';
import { useFmlControl } from '../common/useFmlControl';

const SELECT = 'fml:select';

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [SELECT]: [
      StringUnionOnlyNotString<Value>,
      [Value] extends [string]
        ? string extends Value
          ? never
          : OptionsListConfiguration<Value>
        : // todo: add support for multiple selects...
          never,
    ];
  }
}

type SelectProps<Value> = FmlComponentProps<typeof SELECT, Value>;

export default function Select<Value extends string>(
  props: SelectProps<Value>,
) {
  const [, { label, options }] = props.config as unknown as Configuration<
    'string',
    'fml:select'
  >;

  const {
    blurHandler,
    changeHandler,
    controlId,
    focusHandler,
    validationMessages,
    value,
  } = useFmlControl<'string'>(
    (props.config as unknown as Configuration<'string', 'fml:select'>)[1],
  );

  return (
    <>
      <label data-fml-validity={value.validity} htmlFor={controlId}>
        {label}
      </label>
      <select
        name={controlId}
        id={controlId}
        defaultValue={value.value}
        onChange={(e) =>
          changeHandler({
            value: e.target.value as 'string',
            validity: 'pending',
          })
        }
        onBlur={blurHandler}
        onFocus={focusHandler}
      >
        {Object.keys(options).map((k) => (
          <option key={k} value={k}>
            {options[k as keyof typeof options]}
          </option>
        ))}
      </select>
      <ValidationMessages validationMessages={validationMessages} />
    </>
  );
}

registerComponent(SELECT, Select);
