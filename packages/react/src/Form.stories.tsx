import { FmlFormConfiguration } from '@fml/core';
import Form from './Form';

interface ExampleShape {
  stringProperty?: string;
  boolProperty?: boolean;
  dateProperty: Date;
  collectionProperty: string[];
  objectProperty: {
    property: string;
  };
}

const defaultConfig: FmlFormConfiguration<ExampleShape> = {
  label: 'This is an example',
  schema: {
    stringProperty: {
      label: 'A string property',
      control: 'text',
      defaultValue: '',
    },
    boolProperty: {
      label: 'A string property',
      control: 'checkbox',
      defaultValue: false,
    },
    dateProperty: {
      label: 'A date property',
      control: 'date',
      defaultValue: undefined,
    },
    collectionProperty: {
      label: 'A collection of strings property',
      itemSchema: {
        label: 'Value of this string',
        control: 'text',
        validators: [],
        defaultValue: '',
      },
    },
    objectProperty: {
      label: 'An object property',
      schema: {
        property: {
          label: `The object's property`,
          control: 'text',
          validators: [{ message: 'Oh no!', validator: 'required' }],
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
    <Form
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
        itemSchema: { label: 'sss', control: 'text', defaultValue: '' },
      }}
      formName='stringValue'
      submitText='Submit me!'
    />
  );
};

const stories = {
  title: 'Stories/Form',
  component: Form,
};

export default stories;
