import Date from './Date';

export const DateExample = () => (
  <Date
    config={[
      'fml:date',
      {
        label: 'A date',
        defaultValue: undefined,
      },
    ]}
  />
);

const stories = {
  title: 'Stories/Fml/Controls',
  component: Date,
};

export default stories;
