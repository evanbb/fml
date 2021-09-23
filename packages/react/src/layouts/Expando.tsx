import { ConfigurationFor, registerComponent } from '@fml/core';
import FmlComponent from '../common/FmlComponent';
import { useState } from 'react';
import EXPANDO from '@fml/add/layouts/expando';

interface ExpandoProps {
  config: ConfigurationFor<'fml:expando'>;
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
