import { FmlLayoutConfiguration } from '@fml/core';
import { FmlControlClassifications } from '@fml/core/controls';
import { register } from '@fml/core/layouts';
import FmlComponent from '../common/FmlComponent';
import { useState } from 'react';

declare module '@fml/core/layouts' {
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

register('expando', Expando);
