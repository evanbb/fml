import { FmlConfiguration, FmlValueState } from '@fml/core';
import { FmlContextProvider } from './common/FmlControlContext';
import { FormEvent, useState } from 'react';
import FmlComponent, { getControlConfig } from './common/FmlComponent';

interface submitCallback<TModel> {
  (model: TModel, event: FormEvent<HTMLFormElement>): void;
}

interface FormProps<TModel> {
  config: FmlConfiguration<TModel>;
  formName: string;
  onSubmit: submitCallback<TModel>;
  submitText: string;
}

export default function Form<TModel>({
  config,
  formName,
  onSubmit,
  submitText,
}: FormProps<TModel>) {
  const [value, setValue] = useState<FmlValueState<TModel | undefined>>({
    value: getControlConfig(config).defaultValue as TModel | undefined,
    validity: 'unknown',
  });
  const { validity, value: innerValue } = value;

  return (
    <form onSubmit={(e) => onSubmit(innerValue as TModel, e)}>
      <FmlContextProvider<TModel> localControlId={formName} onChange={setValue}>
        <FmlComponent config={config} />
      </FmlContextProvider>
      <input value={submitText} type='submit' disabled={validity !== 'valid'} />
    </form>
  );
}
