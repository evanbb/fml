import { getFieldImplementation, FieldConfiguration } from '@fml/core';
import { memo } from 'react';
import './fields';

export interface FieldProps<TValue> {
  config: FieldConfiguration<TValue>;
}

function Field<TValue>(props: FieldProps<TValue>) {
  const config = props.config;
  const Ctrl = getFieldImplementation(config.control) as React.ComponentType<
    FieldProps<TValue>
  >;

  return <Ctrl {...props} />;
}

export default memo(Field) as unknown as typeof Field;
