import { Configuration, ConfigurationFor, ValueState } from '@fml/core';
import { FmlContextProvider } from './common/FmlControlContext';
import { FormEvent, useState } from 'react';
import FmlComponent from './common/FmlComponent';

interface submitCallback<TModel> {
  (model: TModel, event: FormEvent<HTMLFormElement>): void;
}

interface FormProps<TModel> {
  config: Configuration<TModel>;
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
  const [value, setValue] = useState<ValueState<TModel | undefined>>({
    value: (config[1] as any).defaultValue as TModel | undefined,
    validity: 'unknown',
  });
  const { validity, value: innerValue } = value;

  return (
    <form onSubmit={(e) => onSubmit(innerValue as TModel, e)}>
      <FmlContextProvider<TModel> localControlId={formName} onChange={setValue}>
        <FmlComponent<typeof config[0]>
          config={config as unknown as ConfigurationFor<typeof config[0]>}
        />
      </FmlContextProvider>
      <input value={submitText} type='submit' disabled={validity !== 'valid'} />
    </form>
  );
}
