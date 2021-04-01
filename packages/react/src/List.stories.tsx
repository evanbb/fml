import { FmlListConfiguration, noop } from '@fml/core';
import List from './List';

const config: FmlListConfiguration<string> = {
  label: 'A bunch of strings',
  itemSchema: {
    label: 'The string value',
    control: 'text',
    defaultValue: '',
  },
};

export const ListOfStrings = () => (
  <List<string>
    config={config}
    controlId='test'
    onChange={noop}
    onFocus={noop}
  />
);

const stories = {
  title: 'Stories/List',
  component: List,
};

export default stories;
