import { Configuration } from '@fml/core';
import '@fml/add/validators/required';
import Form from './Form';
import './layouts/Expando';
import './controls/Model';
import './controls/List';
import './controls/Text';
import './controls/Checkbox';
import './controls/Date';

interface ExampleShape {
  stringProperty?: string;
  boolProperty?: boolean;
  dateProperty: Date;
  collectionProperty: string[];
  objectProperty: {
    property: string;
  };
}

const defaultConfig: Configuration<ExampleShape> = [
  'fml:model',
  {
    label: 'This is an example',
    schema: {
      stringProperty: [
        'fml:text',
        {
          label: 'A string property',
          defaultValue: '',
        },
      ],
      boolProperty: [
        'fml:expando',
        { defaultExpanded: false, summary: 'Something is hidden here' },
        [
          'fml:checkbox',
          {
            label: 'A boolean property',
            control: 'checkbox',
            defaultValue: false,
          },
        ],
      ],
      dateProperty: [
        'fml:date',
        {
          label: 'A date property',
          defaultValue: undefined,
        },
      ],
      collectionProperty: [
        'fml:list',
        {
          label: 'A collection of strings property',
          itemConfig: [
            'fml:text',
            {
              label: 'Value of this string',
              defaultValue: '',
            },
          ],
        },
      ],
      objectProperty: [
        'fml:model',
        {
          label: 'An object property',
          schema: {
            property: [
              'fml:text',
              {
                label: `The object's property`,
                validators: [['required', 'Oh no!']],
                defaultValue: '',
              },
            ],
          },
        },
      ],
    },
  },
];

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
      config={['fml:text', { label: 'stupid text', defaultValue: '' }]}
      formName='stupidform'
      submitText='Submit me!'
    />
  );
};

export const SillyForm = () => {
  return (
    <Form<string[]>
      onSubmit={logit}
      config={[
        'fml:list',
        {
          label: 'lllllll',
          itemConfig: ['fml:text', { label: 'sss', defaultValue: '' }],
        },
      ]}
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
