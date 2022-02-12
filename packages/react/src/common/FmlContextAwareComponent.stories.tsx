import { Configuration } from '@fml/core';
import '../controls/Model';
import '../controls/List';
import '../controls/Text';
import '../layouts/Expando';
import FmlContextAwareComponent from './FmlContextAwareComponent';

interface Pearson {
  firstName: string;
  lastName: string;
  pass: {
    word: string;
    conf: string;
  };
  emails: string[];
}

type O = Configuration<Pearson, 'foobarbutt'>;

const config: Configuration<Pearson> = [
  'fml:model',
  {
    label: 'A person',
    schema: {
      firstName: [
        'fml:text',
        {
          label: 'First name',
        },
      ],
      lastName: [
        'fml:text',
        {
          label: 'First name',
        },
      ],
      pass: [
        'fml:expando',
        {
          defaultExpanded: false,
          summary: 'Click to view and update password',
        },
        [
          'fml:model',
          {
            label: 'Password',
            schema: {
              word: [
                'fml:text',
                {
                  label: 'word',
                },
              ],
              conf: [
                'fml:text',
                {
                  label: 'word',
                },
              ],
            },
          },
        ],
      ],
      emails: [
        'fml:list',
        {
          label: 'Email addresses',
          itemConfig: [
            'fml:text',
            {
              label: 'Email address',
            },
          ],
        },
      ],
    },
  },
];

export const Story = () => (
  <FmlContextAwareComponent config={config} localControlId='foobar' />
);

const stories = {
  title: 'Stories/Fml/Controls/Fml/ContextAwareComponent',
  component: Story,
};

export default stories;
