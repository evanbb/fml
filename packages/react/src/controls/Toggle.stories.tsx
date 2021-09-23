import Toggle from './Toggle';

export const ToggleExample = () => (
  <Toggle
    config={['fml:toggle', { label: 'A checkbox', defaultValue: false }]}
  />
);

const stories = {
  title: 'Stories/Fml/Controls',
  component: Toggle,
};

export default stories;
