import { FmlListConfiguration } from '@fml/core';
import List from './List';

const config: FmlListConfiguration<string> = {
  label: 'list',
  itemConfig: {
    label: 'list item',
    control: 'text',
    defaulValue: '',
  },
};

export const ListOfStrings = () => <List<string> config={config} />;

const stories = {
  title: 'Stories/Fml/List',
  component: List,
};

export default stories;
