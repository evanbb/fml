import { FmlFormConfiguration, FmlValueState } from '@evanbb/fml-core';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import FmlComponent from './common/FmlComponent';

interface submitCallback<TModel> {
  (model: TModel, event: FormEvent<HTMLFormElement>): void;
}

interface FormProps<TModel> {
  config: FmlFormConfiguration<TModel>;
  formName: string;
  onSubmit: submitCallback<TModel>;
  defaultValue?: TModel;
}

export default function Form<TModel>({
  config,
  formName,
  onSubmit,
}: FormProps<TModel>) {
  const [submitEnabled, setSubmitEnabled] = useState(false);

  const [value, setValue] = useState<FmlValueState<typeof config.defaultValue>>(
    { value: config.defaultValue, validity: 'unknown' },
  );
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  const changeHandler = useCallback((change) => {
    setValue(change);
  }, []);
  const focusHandler = useCallback(() => setHasBeenTouched(true), []);
  const { validity, value: innerValue } = value;

  // only runs when validity changes to reduce some churn
  useEffect(() => {
    setSubmitEnabled(validity === 'valid');
  }, [validity]);

  return (
    <form onSubmit={(e) => onSubmit(innerValue as TModel, e)}>
      <FmlComponent
        key={`${formName}-component`}
        config={config}
        onChange={changeHandler}
        onFocus={focusHandler}
        controlId={formName}
      />
      <input type='submit' disabled={!submitEnabled} />
    </form>
  );
}
