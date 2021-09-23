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
  debugger;
  const [key, props] = config;

  const Impl =
    getComponentImplementation<React.ComponentType<{ config: typeof props }>>(
      key,
    );

  return <Impl config={config} />;
}

export default memo(FmlComponent) as typeof FmlComponent;
