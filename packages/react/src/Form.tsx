import { FmlConfiguration, FmlValueState } from '@fml/core';
import { FmlContextProvider } from './common/FmlControlContext';
import { FormEvent, useState } from 'react';
import FmlComponent, { getControlConfig } from './common/FmlComponent';

interface submitCallback<TModel> {
  (event: FormEvent<HTMLFormElement>, model: TModel): void;
}

interface FormProps<TModel> {
  config: FmlConfiguration<TModel>;
  formName: string;
  onSubmit?: submitCallback<TModel>;
  submitText?: string;
}

export default function Form<TModel>({
  config,
  formName,
  onSubmit,
  submitText,
}: FormProps<TModel>) {
  const [value, setValue] = useState<FmlValueState<TModel | undefined>>({
    value: getControlConfig(config).defaulValue as TModel | undefined,
    validity: 'unknown',
  });
  const { validity, value: innerValue } = value;

  const content = (
    <FmlContextProvider<TModel> localControlId={formName} onChange={setValue}>
      <FmlComponent config={config} />
    </FmlContextProvider>
  );

  return onSubmit ? (
    <form onSubmit={(e) => onSubmit?.(e, innerValue as TModel)}>
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
