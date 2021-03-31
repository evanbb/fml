import { FmlListConfiguration, noop } from '@evanbb/fml-core';
import List from './List';

const config: FmlListConfiguration<string> = {
  label: 'A bunch of strings',
  itemSchema: {
    label: 'The string value',
    control: 'text',
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

export default {
  title: 'Stories/List',
  component: List,
};
