import { FmlModelConfiguration, noop } from '@fml/core';
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

export const ExampleModel = () => (
  <Model config={config} controlId='test' onChange={noop} onFocus={noop} />
);

const stories = {
  title: 'Stories/Model',
  component: Model,
};

export default stories;
