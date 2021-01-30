import { Meta } from '@storybook/react';
import { FormConfig } from '@evanbb/fml-core';
import Form from './Form';

interface ExampleShape {
  stringProperty: string;
  collectionProperty: string[];
  objectProperty: {
    property: string;
  };
}

const defaultConfig: FormConfig<ExampleShape> = {
  label: 'This is an example',
  schema: {
    stringProperty: {
      label: 'A string property',
      control: 'text',
    },
    collectionProperty: {
      label: 'A collection of strings property',
      itemSchema: {
        label: 'Value of this string',
        control: 'text',
      },
    },
    objectProperty: {
      label: 'An object property',
      schema: {
        property: {
          label: `The object's property`,
          control: 'text',
        },
      },
    },
  },
};

export const ExampleForm = () => {
  return <Form config={defaultConfig} formName='example' />;
};

export const StupidForm = () => {
  return (
    <Form<string>
      config={{ label: 'lllllll', control: 'text' }}
      formName='stringValue'
    />
  );
};

export const SillyForm = () => {
  return (
    <Form<string[]>
      config={{
        label: 'lllllll',
        itemSchema: { label: 'sss', control: 'text' },
      }}
      formName='stringValue'
    />
  );
};

export default {
  title: 'Stories/Form',
  component: Form,
};
