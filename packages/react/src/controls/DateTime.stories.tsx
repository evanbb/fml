import DateTime from './DateTime';

export const DateTimeExample = () => (
  <DateTime
    config={[
      'fml:datetime',
      {
        label: 'A datetime',
        defaultValue: undefined,
      },
    ]}
  />
);

const stories = {
  title: 'Stories/Fml/Controls',
  component: DateTime,
};

export default stories;
