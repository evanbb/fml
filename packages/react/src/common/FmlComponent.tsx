import {
  ConfigurationFor,
  RegisteredComponents,
  getComponentImplementation,
} from '@fml/core';
import React, { memo } from 'react';

export interface FmlComponentProps<ComponentKey extends RegisteredComponents> {
  config: ConfigurationFor<ComponentKey>;
}

function FmlComponent<ComponentKey extends RegisteredComponents>({
  config,
}: FmlComponentProps<ComponentKey>) {
  const [key, props, children] = config;

  const Impl =
    getComponentImplementation<React.ComponentType<typeof props>>(key);

  return <Impl {...props}>{children as React.ReactNode}</Impl>;
}

export default memo(FmlComponent) as typeof FmlComponent;
