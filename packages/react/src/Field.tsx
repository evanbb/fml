import { getFieldControl, FmlFormStateClassification } from '@fml/core';
import './fields';

export interface FieldProps<Value> {
  formState: FmlFormStateClassification<Value, 'field'>;
}

function Field<Value>({ formState }: FieldProps<Value>) {
  const { control } = formState.state;
  const Ctrl = getFieldControl(control) as React.ComponentType<
    FieldProps<Value>
  >;

  return <Ctrl formState={formState} />;
}

export default Field;
