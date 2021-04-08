import { noop, FmlControlDataType } from '@fml/core';
import {
  render,
  RenderResult,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FmlFieldConfiguration } from 'packages/core/lib/index.es';
import Field from './Field';

type FmlControlTypes = keyof FmlControlDataType<unknown>;

type FmlControlConfigurationMap = {
  [K in FmlControlTypes]: FmlControlDataType<unknown>[K] extends infer TValue
    ? FmlFieldConfiguration<TValue> extends never
      ? FmlFieldConfiguration<'test' | 'testing'> // hack for <select> field
      : FmlFieldConfiguration<TValue>
    : never;
};

const fieldMap: FmlControlConfigurationMap = {
  checkbox: {
    control: 'checkbox',
    defaultValue: false,
    label: 'test',
  },
  date: {
    control: 'date',
    defaultValue: new Date(),
    label: 'test',
  },
  datetime: {
    control: 'datetime',
    defaultValue: new Date(),
    label: 'test',
  },
  hidden: {
    control: 'hidden',
    defaultValue: 'secret!',
    label: 'test',
  },
  number: {
    control: 'number',
    defaultValue: 0,
    label: 'test',
  },
  select: {
    control: 'select',
    defaultValue: 'test',
    options: {
      test: 'test option',
      testing: 'another option',
    },
    label: 'test',
  },
  text: {
    control: 'text',
    defaultValue: '',
    label: 'test',
  },
  textarea: {
    control: 'textarea',
    defaultValue: '',
    label: 'test',
  },
  toggle: {
    control: 'toggle',
    defaultValue: false,
    label: 'test',
  },
};

type FmlFieldAssertionMap = {
  [K in FmlControlTypes]: (renderResult: RenderResult) => Promise<void>;
};

async function waitForValid(container: HTMLElement, test: string) {
  await waitFor(() => {
    expect(container.getAttribute('data-fml-validity') === 'valid').toBe(true);
  });
}

const assertionMap: FmlFieldAssertionMap = {
  checkbox: async ({ container }) => {
    const element = container.querySelector('input') as HTMLInputElement;
    expect(element?.getAttribute('type')).toBe('checkbox');
    expect(element.checked).toBe(false);
    userEvent.click(element);
    expect(element.checked).toBe(true);
    await waitForValid(container.querySelector('label')!, 'checkbox');
  },
  date: async ({ container }) => {
    const element = container.querySelector('input') as HTMLInputElement;
    expect(element?.getAttribute('type')).toBe('date');
    expect(element.value).toBe('');
    fireEvent.change(element, {
      target: {
        value: '2020-05-13',
      },
    });
    const newDate = new Date(element.valueAsNumber);
    expect(newDate.getUTCFullYear()).toBe(2020);
    // month is zero-indexed :D
    expect(newDate.getUTCMonth()).toBe(4);
    expect(newDate.getUTCDate()).toBe(13);
    await waitForValid(container.querySelector('label')!, 'date');
  },
  datetime: async ({ container }) => {
    const element = container.querySelector('input') as HTMLInputElement;
    expect(element?.getAttribute('type')).toBe('datetime-local');
    expect(element.value).toBe('');
    fireEvent.change(element, {
      target: {
        value: '2020-05-13T07:45',
      },
    });
    const newDate = new Date(element.valueAsNumber);
    expect(newDate.getUTCFullYear()).toBe(2020);
    // month is zero-indexed :D
    expect(newDate.getUTCMonth()).toBe(4);
    expect(newDate.getUTCDate()).toBe(13);
    expect(newDate.getUTCHours()).toBe(7);
    await waitForValid(container.querySelector('label')!, 'datetime');
  },
  hidden: async ({ container }) => {
    const element = container.querySelector('input') as HTMLInputElement;
    expect(element?.getAttribute('type')).toBe('hidden');
  },
  number: async ({ container }) => {
    const element = container.querySelector('input') as HTMLInputElement;
    expect(element?.getAttribute('type')).toBe('number');
    userEvent.type(element, '{backspace}100');
    expect(element.value).toEqual('100');
    await waitForValid(container.querySelector('label')!, 'number');
  },
  select: async ({ container }) => {
    const element = container.querySelector('select') as HTMLSelectElement;
    expect(element.options.length).toBe(2);
    expect(element.options[0].value).toBe('test');
    userEvent.selectOptions(element, 'testing');
    expect(element.selectedOptions[0].text).toBe('another option');
    await waitForValid(container.querySelector('label')!, 'select');
  },
  text: async ({ container }) => {
    const element = container.querySelector('input') as HTMLInputElement;
    expect(element?.getAttribute('type')).toBe('text');
    userEvent.type(element, 'new value');
    expect(element.value).toBe('new value');
    await waitForValid(container.querySelector('label')!, 'text');
  },
  textarea: async ({ container }) => {
    const element = container.querySelector('textarea') as HTMLTextAreaElement;
    expect(element).toBeDefined();
    userEvent.type(element, 'new value');
    expect(element.value).toBe('new value');
    await waitForValid(container.querySelector('label')!, 'textarea');
  },
  toggle: async ({ container }) => {
    const element = container.querySelector('input') as HTMLInputElement;
    expect(element?.getAttribute('type')).toBe('checkbox');
    expect(element.checked).toBe(false);
    userEvent.click(element);
    expect(element.checked).toBe(true);
    await waitForValid(container.querySelector('label')!, 'toggle');
  },
};

const keys = Object.keys(fieldMap) as FmlControlTypes[];

const testCases = keys.map((k) => ({
  config: fieldMap[k] as FmlFieldConfiguration<unknown>,
  assertion: assertionMap[k],
}));

it.each(testCases)(
  'renders the appropriate type of field based on configuration',
  async ({ config, assertion }) => {
    const foo = render(
      <Field config={config} controlId={`test-${config.control}`} onChange={noop} onFocus={noop} />,
    );

    await assertion(foo);
  },
);
