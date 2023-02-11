import {
  FmlConfiguration,
  FmlValueStateChangeHandler,
  createStateFromConfig,
} from '@fml/core';
import { FormEvent, useState } from 'react';
import FmlComponent from './common/FmlComponent';

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
  // formName,
  onSubmit,
  submitText,
  onChange,
}: SubmittingFormProps<Model> | ChangingFormProps<Model>) {
  const [formState, setFormState] = useState(() =>
    createStateFromConfig(config, (change) => {
      setFormState((x) => ({
        ...x,
        ...change,
      }));
      onChange?.({
        value: change.value,
        validity: change.validity,
      });
    }),
  );

  const content = <FmlComponent formState={formState} />;

  return onSubmit ? (
    <form onSubmit={(e) => onSubmit(e, formState.value)}>
      {content}
      <input
        value={submitText || 'Submit'}
        type='submit'
        disabled={!formState.state.isValid}
      />
    </form>
  ) : (
    content
  );
}
