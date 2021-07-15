import { FmlConfiguration, FmlValueState } from '@fml/core';
import { FormEvent, useCallback, useState } from 'react';
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
  const [, setHasBeenTouched] = useState(false);
  const focusHandler = useCallback(() => setHasBeenTouched(true), []);
  const { validity, value: innerValue } = value;

  return (
    <form onSubmit={(e) => onSubmit(innerValue as TModel, e)}>
      <FmlComponent
        key={`${formName}-component`}
        config={config}
        onChange={setValue}
        onFocus={focusHandler}
        controlId={formName}
      />
      <input value={submitText} type='submit' disabled={validity !== 'valid'} />
    </form>
  );
}
