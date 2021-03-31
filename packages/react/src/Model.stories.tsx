import { FmlModelConfiguration, noop } from '@evanbb/fml-core';
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
    },
    lastName: {
      label: 'Last Name',
      control: 'text',
    },
  },
};

export const ExampleModel = () => (
  <Model config={config} controlId='test' onChange={noop} onFocus={noop} />
);

export default {
  title: 'Stories/Model',
  component: Model,
};
