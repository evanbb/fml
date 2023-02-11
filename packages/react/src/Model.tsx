import { FmlFormStateClassification } from '@fml/core';
import FmlComponent from './common/FmlComponent';
import ValidationMessages from './ValidationMessages';

export interface ModelProps<Value> {
  formState: FmlFormStateClassification<Value, 'model'>;
}

function Model<Value>({ formState }: ModelProps<Value>) {
  const {
    bindings: { schema: bindingSchema },
    state: { validity, validationMessages, label, schema: stateSchema },
    value,
  } = formState;

  return (
    <fieldset>
      <legend data-fml-validity={validity}>{label}</legend>
      <ValidationMessages validationMessages={validationMessages} />
      {Object.keys(value as {}).map((key) => {
        const k = key as keyof Value;
        return (
          <FmlComponent
            key={key}
            formState={{
              bindings: bindingSchema[k],
              state: stateSchema[k],
              value: value[k],
            }}
          />
        );
      })}
    </fieldset>
  );
}

export default Model;
