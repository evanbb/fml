/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/react';
import {
  FmlFieldConfiguration,
  FmlListConfiguration,
  FmlModelConfiguration,
} from '@fml/core';
import FmlComponent from './FmlComponent';

const fieldConfig: FmlFieldConfiguration<string> = {
  label: 'test field',
  control: 'text',
  defaultValue: '',
};

const modelConfig: FmlModelConfiguration<{ string: string }> = {
  label: 'test model',
  schema: {
    string: {
      label: 'property',
      control: 'text',
      defaultValue: '',
    },
  },
};

const listConfig: FmlListConfiguration<string> = {
  label: 'test list',
  itemConfig: {
    label: 'item',
    control: 'text',
    defaultValue: '',
  },
};

it.each`
  config         | expectedLabel   | expectedTagName
  ${fieldConfig} | ${'test field'} | ${'label'}
  ${modelConfig} | ${'test model'} | ${'legend'}
  ${listConfig}  | ${'test list'}  | ${'label'}
`(
  'renders the appropriate type of component base on the provided configuration',
  async ({ config, expectedLabel, expectedTagName }) => {
    const { getByText } = render(
      <FmlComponent
        config={config}
      />,
    );

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
        {
          something: 'invalid',
        } as any
      }
    />,
  );

  expect(container.innerHTML).toBe('');
});
