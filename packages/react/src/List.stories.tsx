import { ListConfiguration } from '@evanbb/fml-core';
import { FmlContextProvider } from './common/FmlContext';
import List from './List';

const config: ListConfiguration<string> = {
  label: 'A bunch of strings',
  itemSchema: {
    label: 'The string value',
    control: 'text',
  },
};

export const ListOfStrings = () => (
  <FmlContextProvider value={{ currentFormPath: 'myList' }}>
    <List<string> config={config} />
  </FmlContextProvider>
);

export default {
  title: 'Stories/List',
  component: List,
};
