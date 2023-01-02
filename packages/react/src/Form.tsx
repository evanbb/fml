import {
  FmlConfiguration,
  FmlValueState,
  FmlValueStateChangeHandler,
} from '@fml/core';
import { FmlContextProvider } from './common/FmlControlContext';
import { FormEvent, useCallback, useState } from 'react';
import FmlComponent, { getControlConfig } from './common/FmlComponent';

interface submitCallback<Model> {
  (event: FormEvent<HTMLFormElement>, model: Model): void;
}

interface FormProps<Model> {
  config: FmlConfiguration<Model>;
  formName: string;
}

interface SubmittingFormProps<Model> extends FormProps<Model> {
  onSubmit: submitCallback<Model>;
  submitText: string;
  onChange?: never;
}

interface ChangingFormProps<Model> extends FormProps<Model> {
  onSubmit?: never;
  submitText?: never;
  onChange: FmlValueStateChangeHandler<Model>;
}

export default function Form<Model>({
  config,
  formName,
  onSubmit,
  submitText,
  onChange,
}: SubmittingFormProps<Model> | ChangingFormProps<Model>) {
  const [value, setValue] = useState<FmlValueState<Model | undefined>>({
    value: getControlConfig(config).defaultValue as Model | undefined,
    validity: 'unknown',
  });

  const updateValue: FmlValueStateChangeHandler<Model> = useCallback((data) => {
    setValue(data);
    onChange?.(data);
  }, [onChange]);

  const { validity, value: innerValue } = value;

  const content = (
    <FmlContextProvider<Model> localControlId={formName} onChange={updateValue}>
      <FmlComponent config={config} />
    </FmlContextProvider>
  );

  return onSubmit ? (
    <form onSubmit={(e) => onSubmit?.(e, innerValue as Model)}>
      {content}
      <input
        value={submitText || 'Submit'}
        type='submit'
        disabled={validity !== 'valid'}
      />
    </form>
  ) : (
    content
  );
}
