import TextArea from './TextArea';

export const TextAreaExample = () => (
  <TextArea
    config={['fml:textarea', { label: 'Text area', defaultValue: '' }]}
  />
);

const stories = {
  title: 'Stories/Fml/Controls/TextArea',
  component: TextArea,
};

export default stories;
