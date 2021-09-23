import { getComponentImplementation, Configuration } from '@fml/core';
import { memo } from 'react';
import './fields';

export interface FieldProps<TValue> {
  config: Configuration<TValue>;
}

function Field<TValue>(props: FieldProps<TValue>) {
  const config = props.config;
  const Ctrl = getComponentImplementation<
    React.ComponentType<FieldProps<TValue>>
  >(config[0]);

  return <Ctrl {...props} />;
}

export default memo(Field) as unknown as typeof Field;
