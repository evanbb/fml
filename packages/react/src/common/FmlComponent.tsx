import { ConfigurationFor, RegisteredComponents } from '@fml/core';
import { memo } from 'react';

export interface FmlComponentProps<ComponentKey extends RegisteredComponents> {
  config: ConfigurationFor<ComponentKey>;
}

function FmlComponent<ComponentKey extends RegisteredComponents>(
  props: FmlComponentProps<ComponentKey>,
) {
  return null;
}

export default memo(FmlComponent) as typeof FmlComponent;
