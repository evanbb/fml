import { render, waitFor } from '@testing-library/react';
import {
  FmlFieldConfiguration,
  FmlListConfiguration,
  FmlModelConfiguration,
  noop,
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
  itemSchema: {
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
        controlId='test'
        onChange={noop}
        onFocus={noop}
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
      controlId='test'
      config={{
        something: 'invalid',
      } as any}
      onChange={noop}
      onFocus={noop}
    />,
  );

  expect(container.innerHTML).toBe('')
});
