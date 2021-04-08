import { waitFor, render } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import { noop } from '@fml/core';
import List from './List';

async function waitForValid(listLabel: HTMLElement) {
  await waitFor(() => {
    expect(listLabel.getAttribute('data-fml-validity')).toBe('valid');
  });
}

it('renders items in the list', async () => {
  const { getByText } = render(
    <List<string>
      config={{
        label: 'My list',
        itemSchema: {
          control: 'text',
          label: 'List item',
          defaultValue: '',
        },
        defaultValue: ['first', 'second', 'third'],
      }}
      controlId='test'
      onChange={noop}
      onFocus={noop}
    />,
  );

  const listLabel = getByText('My list');

  await waitForValid(listLabel);
});

it('adds items to the list', async () => {
  const { getAllByLabelText, getByText } = render(
    <List<string>
      config={{
        label: 'My list',
        itemSchema: {
          control: 'text',
          label: 'List item',
          defaultValue: '',
        },
      }}
      controlId='test'
      onChange={noop}
      onFocus={noop}
    />,
  );

  const listLabel = getByText('My list');
  const addButton = getByText('+');

  userEvents.click(addButton);
  userEvents.click(addButton);
  userEvents.click(addButton);

  await waitForValid(listLabel);

  const itemLabels = getAllByLabelText('List item');

  expect(itemLabels.length).toBe(3);
});

it('removes items from the list, maintaining order', async () => {
  const { getAllByText, getByText, getAllByLabelText } = render(
    <List<string>
      config={{
        label: 'My list',
        itemSchema: {
          control: 'text',
          label: 'List item',
          defaultValue: '',
        },
        defaultValue: ['first', 'second', 'third'],
      }}
      controlId='test'
      onChange={noop}
      onFocus={noop}
    />,
  );

  const listLabel = getByText('My list');
  const removeButtons = getAllByText('-');

  expect(removeButtons.length).toBe(3);

  userEvents.click(removeButtons[1]);

  const newRemoveButtons = getAllByText('-');
  expect(newRemoveButtons.length).toBe(2);

  const inputs = getAllByLabelText('List item');
  expect(inputs.map((input) => (input as HTMLInputElement).value)).toEqual([
    'first',
    'third',
  ]);

  await waitForValid(listLabel);
});

it('updates items in the list', async () => {
  const { getByText, getAllByLabelText, getAllByText } = render(
    <List<string>
      config={{
        label: 'My list',
        itemSchema: {
          control: 'text',
          label: 'List item',
          defaultValue: '',
        },
        defaultValue: ['first', 'second', 'third'],
      }}
      controlId='test'
      onChange={noop}
      onFocus={noop}
    />,
  );

  const listLabel = getByText('My list');
  const inputs = getAllByLabelText('List item');
  const inputLabels = getAllByText('List item');

  expect(inputs.map((input) => (input as HTMLInputElement).value)).toEqual([
    'first',
    'second',
    'third',
  ]);

  userEvents.type(inputs[1], '{selectall}{backspace}new value');

  await waitFor(() =>
    expect(
      inputLabels.some(
        (label) => label.getAttribute('data-fml-validity') !== 'valid',
      ),
    ).toBe(false),
  );

  expect(inputs.map((input) => (input as HTMLInputElement).value)).toEqual([
    'first',
    'new value',
    'third',
  ]);

  await waitFor(() =>
    expect(
      inputLabels.some(
        (label) => label.getAttribute('data-fml-validity') !== 'valid',
      ),
    ).toBe(false),
  );

  await waitForValid(listLabel);
});

it('bubbles validity from list items', async () => {
  const { getByText, getAllByLabelText, getAllByText } = render(
    <List<string>
      config={{
        label: 'My list',
        itemSchema: {
          control: 'text',
          label: 'List item',
          defaultValue: '',
          validators: [{ validator: 'required', message: 'this is required' }],
        },
        defaultValue: ['first', 'second', 'third'],
      }}
      controlId='test'
      onChange={noop}
      onFocus={noop}
    />,
  );

  const listLabel = getByText('My list');
  const inputs = getAllByLabelText('List item');
  const inputLabels = getAllByText('List item');

  expect(inputs.map((input) => (input as HTMLInputElement).value)).toEqual([
    'first',
    'second',
    'third',
  ]);

  // everything is unknown right now, because validation hasnt fired
  expect(listLabel.getAttribute('data-fml-validity')).toBe('unknown');

  userEvents.type(inputs[1], '{selectall}{backspace}');

  expect(inputs.map((input) => (input as HTMLInputElement).value)).toEqual([
    'first',
    '',
    'third',
  ]);

  // made one change, began validating second element, which will fail
  expect(inputLabels[0].getAttribute('data-fml-validity')).toBe('unknown');
  expect(inputLabels[1].getAttribute('data-fml-validity')).toBe('pending');
  expect(inputLabels[2].getAttribute('data-fml-validity')).toBe('unknown');
  expect(listLabel.getAttribute('data-fml-validity')).toBe('unknown');

  // change the first and third to kick off their validation
  userEvents.type(inputs[0], '{selectall}{backspace}this is the first');
  userEvents.type(inputs[2], '{selectall}{backspace}this is the third');

  expect(inputLabels[0].getAttribute('data-fml-validity')).toBe('pending');
  expect(inputLabels[1].getAttribute('data-fml-validity')).toBe('pending');
  expect(inputLabels[2].getAttribute('data-fml-validity')).toBe('pending');
  // none of the validators have resolved yet, so list validity is still unknown
  expect(listLabel.getAttribute('data-fml-validity')).toBe('unknown');

  // eventually the middle one resolves to be invalid
  await waitFor(() =>
    expect(inputLabels[1].getAttribute('data-fml-validity')).toBe('invalid'),
  );

  // fix it
  userEvents.type(inputs[1], 'new value');

  // wait for validity to bubble up to the root
  await waitForValid(listLabel);

  expect(inputLabels[0].getAttribute('data-fml-validity')).toBe('valid');
  expect(inputLabels[1].getAttribute('data-fml-validity')).toBe('valid');
  expect(inputLabels[2].getAttribute('data-fml-validity')).toBe('valid');
  expect(listLabel.getAttribute('data-fml-validity')).toBe('valid');
});

it('uses provided value as default for list item, falling back to defaultValue configured in itemSchema', async () => {
  /** defined default */
  const { getAllByLabelText, getByText, unmount } = render(
    <List<string>
      config={{
        label: 'My list',
        itemSchema: {
          control: 'text',
          label: 'List item',
          defaultValue: 'default value',
        },
        defaultValue: ['first', 'second', 'third'],
      }}
      controlId='test'
      onChange={noop}
      onFocus={noop}
    />,
  );

  const listLabel = getByText('My list');
  const addButton = getByText('+');

  userEvents.click(addButton);
  userEvents.click(addButton);
  userEvents.click(addButton);

  await waitForValid(listLabel);

  const itemLabels = getAllByLabelText('List item');

  expect(itemLabels.length).toBe(6);

  expect((itemLabels[0] as HTMLInputElement).value).toBe('first');
  expect((itemLabels[1] as HTMLInputElement).value).toBe('second');
  expect((itemLabels[2] as HTMLInputElement).value).toBe('third');
  expect((itemLabels[3] as HTMLInputElement).value).toBe('default value');
  expect((itemLabels[4] as HTMLInputElement).value).toBe('default value');
  expect((itemLabels[5] as HTMLInputElement).value).toBe('default value');

  unmount();

  /** undefined default */
  const {
    getAllByLabelText: getAllByLabelText2,
    getByText: getByText2,
  } = render(
    <List<string>
      config={{
        label: 'My list',
        itemSchema: {
          control: 'text',
          label: 'List item',
          defaultValue: undefined,
        },
        defaultValue: ['first', 'second', 'third'],
      }}
      controlId='test'
      onChange={noop}
      onFocus={noop}
    />,
  );

  const listLabel2 = getByText2('My list');
  const addButton2 = getByText2('+');

  userEvents.click(addButton2);
  userEvents.click(addButton2);
  userEvents.click(addButton2);

  await waitForValid(listLabel2);

  const itemLabels2 = getAllByLabelText2('List item');

  expect(itemLabels2.length).toBe(6);

  expect((itemLabels2[0] as HTMLInputElement).value).toBe('first');
  expect((itemLabels2[1] as HTMLInputElement).value).toBe('second');
  expect((itemLabels2[2] as HTMLInputElement).value).toBe('third');
  expect((itemLabels2[3] as HTMLInputElement).value).toBe('');
  expect((itemLabels2[4] as HTMLInputElement).value).toBe('');
  expect((itemLabels2[5] as HTMLInputElement).value).toBe('');
});
