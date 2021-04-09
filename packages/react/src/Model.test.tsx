/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import Model from './Model';

interface TestModel {
  foo: string;
  bar: number[];
  baz: {
    qux: boolean;
  };
}

async function waitForValid(label: HTMLElement) {
  await waitFor(() =>
    expect(label.getAttribute('data-fml-validity')).toBe('valid'),
  );
}

it('renders appropriate components for each property', async () => {
  const { getByText, getByLabelText, getByRole } = render(
    <Model<TestModel>
      config={{
        label: 'Test model',
        schema: {
          foo: {
            control: 'text',
            defaultValue: undefined,
            label: 'Foo',
          },
          bar: {
            label: 'Bar',
            itemConfig: {
              control: 'number',
              defaultValue: undefined,
              label: 'Number',
            },
          },
          baz: {
            label: 'Baz',
            schema: {
              qux: {
                control: 'checkbox',
                defaultValue: false,
                label: 'Qux',
              },
            },
          },
        },
      }}
    />,
  );

  const formLabel = getByText('Test model');

  await waitForValid(formLabel);

  const fooInput = getByLabelText('Foo');
  const barContainer = getByRole('group', {
    name: 'Bar',
  });
  const bazLegend = getByText('Baz');
  const quxInput = getByLabelText('Qux');

  expect(fooInput.getAttribute('type')).toBe('text');
  expect(barContainer).toBeDefined();
  expect(bazLegend.tagName.toLowerCase()).toBe('legend');
  expect(quxInput.getAttribute('type')).toBe('checkbox');
});

it('bubbles up validation errors', async () => {
  const { getByText } = render(
    <Model<TestModel>
      config={{
        label: 'Test model',
        schema: {
          foo: {
            control: 'text',
            defaultValue: 'valid value',
            label: 'Foo',
            validators: [['required', 'required srsly']],
          },
          bar: {
            label: 'Bar',
            itemConfig: {
              control: 'number',
              defaultValue: undefined,
              label: 'Number',
            },
          },
          baz: {
            label: 'Baz',
            schema: {
              qux: {
                control: 'checkbox',
                defaultValue: false,
                label: 'Qux',
              },
            },
          },
        },
      }}
    />,
  );

  const modelLegend = getByText('Test model');
  const fooLabel = getByText('Foo');
  const barLabel = getByText('Bar');
  const bazLegend = getByText('Baz');
  const quxLabel = getByText('Qux');

  expect(modelLegend.getAttribute('data-fml-validity')).toBe('unknown');
  expect(fooLabel.getAttribute('data-fml-validity')).toBe('unknown');
  expect(barLabel.getAttribute('data-fml-validity')).toBe('pending');
  expect(bazLegend.getAttribute('data-fml-validity')).toBe('pending');
  expect(quxLabel.getAttribute('data-fml-validity')).toBe('valid');

  await waitFor(() =>
    expect(barLabel.getAttribute('data-fml-validity')).toBe('valid'),
  );

  await waitFor(() =>
    expect(bazLegend.getAttribute('data-fml-validity')).toBe('valid'),
  );

  /**
   * two properties are valid, but one is unknown, so form is also unknown
   */
  expect(modelLegend.getAttribute('data-fml-validity')).toBe('unknown');

  userEvents.type(fooLabel, '{selectall}{backspace}');

  expect(fooLabel.getAttribute('data-fml-validity')).toBe('pending');

  // foo is invalid...
  await waitFor(() =>
    expect(fooLabel.getAttribute('data-fml-validity')).toBe('invalid'),
  );

  // ...so the model is invalid
  await waitFor(() =>
    expect(modelLegend.getAttribute('data-fml-validity')).toBe('invalid'),
  );

  userEvents.type(fooLabel, 'all fixed up');

  expect(fooLabel.getAttribute('data-fml-validity')).toBe('pending');

  // foo is now valid...
  await waitFor(() =>
    expect(fooLabel.getAttribute('data-fml-validity')).toBe('valid'),
  );

  // ...so now all three properties are valid! yay!
  await waitFor(() =>
    expect(modelLegend.getAttribute('data-fml-validity')).toBe('valid'),
  );
});
