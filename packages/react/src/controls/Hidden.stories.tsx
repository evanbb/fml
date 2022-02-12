import Hidden from './Hidden';

export const HiddenExample = () => (
  <Hidden
    config={[
      'fml:hidden',
      {
        label: 'A hidden value',
        defaultValue: '',
      },
    ]}
  />
);

const stories = {
  title: 'Stories/Fml/Controls/Hidden',
  component: Hidden,
};

export default stories;
