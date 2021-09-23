import { Configuration } from '@fml/core';
import '../controls/Text';
import Expando, { ExpandoProps } from './Expando';

const config: Configuration<string> = [
  'fml:expando',
  {
    defaultExpanded: false,
    summary: 'click me to expand and see my content!',
  },
  [
      'fml:text',
      {
          label: 'a text input!'
      }
  ],
];

export const ExpandoExample = () => <Expando config={config as ExpandoProps['config']}></Expando>;

const stories = {
  title: 'Stories/Fml/Layouts',
  component: Expando,
};

export default stories;
