import {
  Configuration,
  ConfigurationKeyed,
  registerComponent,
} from '@fml/core';
import FmlComponent from '../common/FmlComponent';
import { useState } from 'react';

const EXPANDO = 'fml:expando';

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [EXPANDO]: [any, ExpandoConfig];
  }
}

interface ExpandoConfig {
  defaultExpanded: boolean;
  summary: string;
}

interface ExpandoProps<Value> {
  config: ConfigurationKeyed<'fml:expando'>;
}

function Expando<TValue>({
  config: [, { defaultExpanded, summary }],
}: ExpandoProps<TValue>) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <>
      <div>
        <p onClick={(e) => setExpanded((x) => !x)}>{summary}</p>
        <div style={expanded ? {} : { display: 'none' }}>
          <FmlComponent
            {...{
              config: ['fml:expando', { defaultExpanded: false, summary: '' }],
            }}
          />
        </div>
      </div>
    </>
  );
}

registerComponent(EXPANDO, Expando);
