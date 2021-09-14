import { FmlConfiguration } from '@fml/core';
import '@fml/add/validators/required'
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
      defaultValue: '',
    },
    boolProperty: [
      'expando',
      { defaultExpanded: false, summary: 'Something is hidden here' },
      {
        label: 'A boolean property',
        control: 'checkbox',
        defaultValue: false,
      },
    ],
    dateProperty: {
      label: 'A date property',
      control: 'date',
      defaultValue: undefined,
    },
    collectionProperty: {
      label: 'A collection of strings property',
      itemConfig: {
        label: 'Value of this string',
        control: 'text',
        defaultValue: '',
      },
    },
    objectProperty: {
      label: 'An object property',
      schema: {
        property: {
          label: `The object's property`,
          control: 'text',
          validators: [['required', 'Oh no!']],
          defaultValue: '',
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
      config={{ label: 'stupid text', control: 'text', defaultValue: '' }}
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
        itemConfig: { label: 'sss', control: 'text', defaultValue: '' },
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
