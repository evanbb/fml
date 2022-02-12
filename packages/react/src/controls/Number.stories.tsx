import '@fml/add/validators/required';
import Number from './Number';

export const NumberExample = () => (
  <Number
    config={[
      'fml:number',
      {
        label: 'A number',
        validators: [['required', 'This is required, dawg']],
        defaultValue: undefined,
      },
    ]}
  />
);

const stories = {
  title: 'Stories/Fml/Controls/Number',
  component: Number,
};

export default stories;
