import '@fml/add/validators/required'
import Checkbox from './Checkbox';

export const CheckboxExample = () => (
  <Checkbox
    config={[
      'fml:checkbox',
      {
        label: 'A checkbox',
        validators: [['required', 'Check this, please']],
        defaultValue: false,
      },
    ]}
  />
);

const stories = {
  title: 'Stories/Fml/Controls/Checkbox',
  component: Checkbox,
};

export default stories;
