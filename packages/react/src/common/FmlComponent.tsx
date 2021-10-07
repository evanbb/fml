import {
  ConfigurationFor,
  RegisteredComponents,
  getComponentImplementation,
} from '@fml/core';
import React, { memo } from 'react';

export interface FmlComponentProps<
  ComponentKey extends RegisteredComponents,
  Value = never,
> {
  config: ConfigurationFor<ComponentKey, Value>;
}

function FmlComponent<ComponentKey extends RegisteredComponents>({
  config,
}: FmlComponentProps<ComponentKey>) {
  const [key, props] = config;

  const Impl =
    getComponentImplementation<React.ComponentType<{ config: typeof props }>>(
      key,
    );

  if (!Impl) {
    console.warn(`Unable to find a component at key "${key}" in the registry`)
    return null;
  }

  return <Impl config={config} />;
}

export default memo(FmlComponent) as typeof FmlComponent;
