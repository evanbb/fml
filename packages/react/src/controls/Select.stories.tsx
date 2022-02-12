import Select from './Select';

export const SelectExample = () => (
  <Select<'a' | 'b' | 'c'>
    config={[
      'fml:select',
      {
        label: 'A few options',
        options: { a: 'Option A', b: 'Option B', c: 'Option C' },
        defaultValue: 'b',
      },
    ]}
  />
);

const stories = {
  title: 'Stories/Fml/Controls/Select',
  component: Select,
};

export default stories;
