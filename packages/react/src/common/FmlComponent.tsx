import { ConfigurationKeyed, RegisteredComponents } from '@fml/core';
import { memo } from 'react';

export interface FmlComponentProps<Key extends RegisteredComponents> {
  config: ConfigurationKeyed<Key>;
}

function FmlComponent<Key extends RegisteredComponents>(
  props: FmlComponentProps<Key>,
) {
  return null;
}

export default memo(FmlComponent) as typeof FmlComponent;
