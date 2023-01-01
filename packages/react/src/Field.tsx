import { getFieldImplementation, FmlFieldConfiguration } from '@fml/core';
import { memo } from 'react';
import './fields';

export interface FieldProps<Value> {
  config: FmlFieldConfiguration<Value>;
}

function Field<Value>(props: FieldProps<Value>) {
  const config = props.config;
  const Ctrl = getFieldImplementation(config.control) as React.ComponentType<
    FieldProps<Value>
  >;

  return <Ctrl {...props} />;
}

export default memo(Field) as unknown as typeof Field;
