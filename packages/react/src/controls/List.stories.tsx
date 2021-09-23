import '@fml/add/controls/text';
import { Configuration } from '@fml/core';
import List from './List';

const config: Configuration<string[]> = [
  'fml:list',
  {
    label: 'list',
    itemConfig: ['fml:text', {
      label: 'list item',
      defaultValue: '',
    }],
  },
];

export const ListOfStrings = () => <List<string> config={config} />;

const stories = {
  title: 'Stories/Fml/List',
  component: List,
};

export default stories;
