import { FmlConfiguration } from '@fml/core';
import '@fml/add/validators/required';
import Form from './Form';
import './layouts/Expando';

interface ExampleShape {
  stringProperty?: string;
  boolProperty?: boolean;
  dateProperty: Date;
  collectionProperty: string[];
  objectProperty: {
    property: string;
  };
}

const defaultConfig: FmlConfiguration<ExampleShape> = {
  label: 'This is an example',
  schema: {
    stringProperty: {
      label: 'A string property',
      control: 'text',
      defaulValue: '',
    },
    boolProperty: {
      label: 'A boolean property',
      control: 'checkbox',
      defaulValue: false,
    },
    dateProperty: {
      label: 'A date property',
      control: 'date',
      defaulValue: undefined,
    },
    collectionProperty: {
      label: 'A collection of strings property',
      itemConfig: {
        label: 'Value of this string',
        control: 'text',
        defaulValue: '',
      },
    },
    objectProperty: {
      label: 'An object property',
      schema: {
        property: {
          label: `The object's property`,
          control: 'text',
          validators: [['required', 'Oh no!']],
          defaulValue: '',
        },
      },
    },
  },
};

const logit = (x: any, e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log(x);
};

export const ExampleForm = () => {
  return (
    <Form<ExampleShape>
      onSubmit={logit}
      config={defaultConfig}
      formName='example'
      submitText='Submit me!'
    />
  );
};

export const StupidForm = () => {
  return (
    <Form<string>
      onSubmit={logit}
      config={{ label: 'stupid text', control: 'text', defaulValue: '' }}
      formName='stupidform'
      submitText='Submit me!'
    />
  );
};

export const SillyForm = () => {
  return (
    <Form<string[]>
      onSubmit={logit}
      config={{
        label: 'lllllll',
        itemConfig: { label: 'sss', control: 'text', defaulValue: '' },
      }}
      formName='stringValue'
      submitText='Submit me!'
    />
  );
};

const stories = {
  title: 'Stories/Fml/Form',
  component: Form,
};

export default stories;
