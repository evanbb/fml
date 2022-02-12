import Text from './Text';

export const TextExample = () => (
  <Text config={['fml:text', { label: 'Text input', defaultValue: '' }]} />
);

const stories = {
  title: 'Stories/Fml/Controls/Text',
  component: Text,
};

export default stories;
