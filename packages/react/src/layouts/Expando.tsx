import { ConfigurationFor, registerComponent } from '@fml/core';
import FmlComponent from '../common/FmlComponent';
import { useState } from 'react';

const EXPANDO = 'fml:expando';

declare module '@fml/core' {
  export interface ExpandoConfig {
    defaultExpanded: boolean;
    summary: string;
  }

  export interface ComponentRegistry<Value> {
    [EXPANDO]: [any, ExpandoConfig, any];
  }
}

export interface ExpandoProps {
  config: ConfigurationFor<typeof EXPANDO>;
}

function Expando({
  config: [, { defaultExpanded, summary }, config],
}: ExpandoProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <>
      <div>
        <p onClick={(e) => setExpanded((x) => !x)}>{summary}</p>
        <div style={expanded ? {} : { display: 'none' }}>
          <FmlComponent config={config} />
        </div>
      </div>
    </>
  );
}

registerComponent(EXPANDO, Expando);

export default Expando