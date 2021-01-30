import { ModelConfiguration } from '@evanbb/fml-core';
import { FmlContextProvider } from './common/FmlContext';
import Model from './Model';

interface MyModel {
  firstName: string;
  lastName: string;
}

const config: ModelConfiguration<MyModel> = {
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
  <FmlContextProvider value={{ currentFormPath: 'myModel' }}>
    <Model config={config} />
  </FmlContextProvider>
);

export default {
  title: 'Stories/Model',
  component: Model,
};
