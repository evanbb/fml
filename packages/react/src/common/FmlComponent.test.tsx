/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/react';
import { Configuration } from '@fml/core';
import FmlComponent from './FmlComponent';
import '../controls/Text';
import '../controls/Model';
import '../controls/List';

const fieldConfig: Configuration<string> = [
  'fml:text',
  {
    label: 'test field',
    defaultValue: '',
  },
];

const modelConfig: Configuration<{ string: string }> = [
  'fml:model',
  {
    label: 'test model',
    schema: {
      string: [
        'fml:text',
        {
          label: 'property',
          defaultValue: '',
        },
      ],
    },
  },
];

const listConfig: Configuration<string[]> = [
  'fml:list',
  {
    label: 'test list',
    itemConfig: [
      'fml:text',
      {
        label: 'item',
        defaultValue: '',
      },
    ],
  },
];

it.each`
  config         | expectedLabel   | expectedTagName
  ${fieldConfig} | ${'test field'} | ${'label'}
  ${modelConfig} | ${'test model'} | ${'legend'}
  ${listConfig}  | ${'test list'}  | ${'label'}
`(
  'renders the appropriate type of component base on the provided configuration',
  async ({ config, expectedLabel, expectedTagName }) => {
    const { getByText } = render(<FmlComponent config={config} />);

    const element = getByText(expectedLabel);

    expect(element).toBeDefined();

    expect(element.tagName.toLowerCase()).toBe(expectedTagName);

    await waitFor(() => element.getAttribute('data-fml-validity') === 'valid');
  },
);

it('renders nothing if an invalid configuration is passed', () => {
  const { container } = render(
    <FmlComponent
      config={
        [
          'garbage',
          {
            something: 'invalid',
          },
        ] as any
      }
    />,
  );

  expect(container.innerHTML).toBe('');
});
