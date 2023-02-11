import { FmlModelConfiguration } from '@fml/core';
import Model from './Model';

interface MyModel {
  firstName: string;
  lastName: string;
}

const config: FmlModelConfiguration<MyModel> = {
  label: 'My model',
  schema: {
    firstName: {
      label: 'First Name',
      control: 'text',
      defaultValue: '',
    },
    lastName: {
      label: 'Last Name',
      control: 'text',
      defaultValue: '',
    },
  },
};

// export const ExampleModel = () => <Model config={config} />;

const stories = {
  title: 'Stories/Fml/Model',
  component: Model,
};

export default stories;
