import { FmlLayoutConfiguration, registerLayout } from '@fml/core';
import FmlComponent from '../common/FmlComponent';
import { useState } from 'react';

declare module '@fml/core' {
  export interface FmlLayoutRegistry<TValue> {
    expando: [FmlControlClassifications, ExpandoConfig];
  }
}

interface ExpandoConfig {
  defaultExpanded: boolean;
  summary: string;
}

interface ExpandoProps<TValue> {
  config: FmlLayoutConfiguration<TValue, 'expando'>;
}

function Expando<TValue>({
  config: [, { defaultExpanded, summary }, componentConfig],
}: ExpandoProps<TValue>) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <>
      <div>
        <p onClick={(e) => setExpanded((x) => !x)}>{summary}</p>
        <div style={expanded ? {} : { display: 'none' }}>
          <FmlComponent {...{ config: componentConfig }} />
        </div>
      </div>
    </>
  );
}

registerLayout('expando', Expando);
