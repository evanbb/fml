import {
  isFieldState,
  isModelState,
  isListState,
  FmlFormState,
} from '@fml/core';
import Field from '../Field';
import List from '../List';
import Model from '../Model';

export interface FmlComponentProps<Value> {
  formState: FmlFormState<Value>;
}

function FmlComponent<Value>({ formState }: FmlComponentProps<Value>) {
  return isFieldState(formState) ? (
    <Field<Value> formState={formState} />
  ) : isListState<Value>(formState) ? (
    <List<Value> formState={formState}  />
  ) : isModelState<Value>(formState) ? (
    <Model<Value> formState={formState} />
  ) : null;
}

export default FmlComponent;
