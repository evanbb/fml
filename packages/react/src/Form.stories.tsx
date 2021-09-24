import { Configuration } from '@fml/core';
import '@fml/add/validators/required';
import Form from './Form';
import './layouts/Expando';
import './controls/Model';
import './controls/List';
import './controls/Text';
import './controls/Checkbox';
import './controls/Date';

interface Person {
  fullName?: string;
  isBoring?: boolean;
  birthdate: Date;
  hobbies: string[];
  hair: {
    color: string;
  };
}

const defaultConfig: Configuration<Person> = [
  'fml:model',
  {
    label: 'This is a person',
    schema: {
      fullName: [
        'fml:text',
        {
          label: 'full name',
          defaultValue: '',
        },
      ],
      isBoring: [
        'fml:expando',
        { defaultExpanded: false, summary: 'Something is hidden here! 👻' },
        [
          'fml:checkbox',
          {
            label: 'this person is boring',
            control: 'checkbox',
            defaultValue: false,
          },
        ],
      ],
      birthdate: [
        'fml:date',
        {
          label: 'birthdate',
          defaultValue: undefined,
        },
      ],
      hobbies: [
        'fml:list',
        {
          label: 'A collection of hobbies this person enjoys',
          itemConfig: [
            'fml:text',
            {
              label: 'hobby description',
              defaultValue: '',
            },
          ],
        },
      ],
      hair: [
        'fml:model',
        {
          label: 'hair descriptors',
          schema: {
            color: [
              'fml:text',
              {
                label: `hair color`,
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
    <Form<Person>
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
