import List from './List';
import './Text';

export const ListOfStrings = () => (
  <List<string>
    config={[
      'fml:list',
      {
        label: 'list',
        itemConfig: [
          'fml:text',
          {
            label: 'list item',
            defaultValue: '',
          },
        ],
      },
    ]}
  />
);

const stories = {
  title: 'Stories/Fml/List',
  component: List,
};

export default stories;
