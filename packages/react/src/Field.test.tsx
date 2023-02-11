/**
 * @jest-environment jsdom
 */
import {
  FmlFieldConfiguration,
  FmlFieldControlRegistry,
  FmlRegisteredFieldControls,
} from '@fml/core';
// import {
//   render,
//   RenderResult,
//   waitFor,
//   fireEvent,
// } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import Field from './Field';

// type FmlControlConfigurationMap = {
//   [K in FmlRegisteredFieldControls]: FmlFieldControlRegistry<unknown>[K][0] extends infer Value
//     ? FmlFieldConfiguration<Value> extends never
//       ? FmlFieldConfiguration<'test' | 'testing'> // hack for <select> field
//       : FmlFieldConfiguration<Value>
//     : never;
// };

// const fieldMap: FmlControlConfigurationMap = {
//   checkbox: {
//     control: 'checkbox',
//     defaultValue: false,
//     label: 'test',
//   },
//   date: {
//     control: 'date',
//     defaultValue: new Date(),
//     label: 'test',
//   },
//   datetime: {
//     control: 'datetime',
//     defaultValue: new Date(),
//     label: 'test',
//   },
//   hidden: {
//     control: 'hidden',
//     label: '',
//     defaultValue: '',
//   },
//   number: {
//     control: 'number',
//     defaultValue: 0,
//     label: 'test',
//   },
//   radios: {
//     control: 'select',
//     defaultValue: 'test',
//     options: {
//       test: 'test option',
//       testing: 'another option',
//     },
//     label: 'test',
//   },
//   select: {
//     control: 'select',
//     defaultValue: 'test',
//     options: {
//       test: 'test option',
//       testing: 'another option',
//     },
//     label: 'test',
//   },
//   text: {
//     control: 'text',
//     defaultValue: '',
//     label: 'test',
//   },
//   textarea: {
//     control: 'textarea',
//     defaultValue: '',
//     label: 'test',
//   },
//   toggle: {
//     control: 'toggle',
//     defaultValue: false,
//     label: 'test',
//   },
// };

// type FmlFieldAssertionMap = {
//   [K in FmlRegisteredFieldControls]: (
//     renderResult: RenderResult,
//   ) => Promise<void>;
// };

// async function waitForValid(container: HTMLElement, test: string) {
//   try {
//     await waitFor(() => {
//       expect(container.getAttribute('data-fml-validity') === 'valid').toBe(
//         true,
//       );
//     });
//   } catch (e) {
//     console.error('error waiting for validity in test for ' + test, e);
//   }
// }

// const assertionMap: FmlFieldAssertionMap = {
//   checkbox: async ({ container }) => {
//     const element = container.querySelector('input') as HTMLInputElement;
//     expect(element?.getAttribute('type')).toBe('checkbox');
//     expect(element.checked).toBe(false);
//     userEvent.click(element);
//     expect(element.checked).toBe(true);
//     await waitForValid(container.querySelector('label')!, 'checkbox');
//   },
//   date: async ({ container }) => {
//     const element = container.querySelector('input') as HTMLInputElement;
//     expect(element?.getAttribute('type')).toBe('date');
//     expect(element.value).toBe('');
//     fireEvent.change(element, {
//       target: {
//         value: '2020-05-13',
//       },
//     });
//     const newDate = new Date(element.valueAsNumber);
//     expect(newDate.getUTCFullYear()).toBe(2020);
//     // month is zero-indexed :D
//     expect(newDate.getUTCMonth()).toBe(4);
//     expect(newDate.getUTCDate()).toBe(13);
//     await waitForValid(container.querySelector('label')!, 'date');
//   },
//   datetime: async ({ container }) => {
//     const element = container.querySelector('input') as HTMLInputElement;
//     expect(element?.getAttribute('type')).toBe('datetime-local');
//     expect(element.value).toBe('');
//     fireEvent.change(element, {
//       target: {
//         value: '2020-05-13T07:45',
//       },
//     });
//     const newDate = new Date(element.valueAsNumber);
//     expect(newDate.getUTCFullYear()).toBe(2020);
//     // month is zero-indexed :D
//     expect(newDate.getUTCMonth()).toBe(4);
//     expect(newDate.getUTCDate()).toBe(13);
//     expect(newDate.getUTCHours()).toBe(7);
//     await waitForValid(container.querySelector('label')!, 'datetime');
//   },
//   hidden: async ({ container }) => {
//     const element = container.querySelector('input') as HTMLInputElement;
//     expect(element?.getAttribute('type')).toBe('hidden');
//   },
//   number: async ({ container }) => {
//     const element = container.querySelector('input') as HTMLInputElement;
//     expect(element?.getAttribute('type')).toBe('number');
//     userEvent.type(element, '{backspace}100');
//     expect(element.value).toEqual('100');
//     await waitForValid(container.querySelector('label')!, 'number');
//   },
//   radios: async ({ container }) => {
//     // todo: test implementation
//   },
//   select: async ({ container }) => {
//     const element = container.querySelector('select') as HTMLSelectElement;
//     expect(element.options.length).toBe(2);
//     expect(element.options[0].value).toBe('test');
//     userEvent.selectOptions(element, 'testing');
//     expect(element.selectedOptions[0].text).toBe('another option');
//     await waitForValid(container.querySelector('label')!, 'select');
//   },
//   text: async ({ container }) => {
//     const element = container.querySelector('input') as HTMLInputElement;
//     expect(element?.getAttribute('type')).toBe('text');
//     userEvent.type(element, 'new value');
//     expect(element.value).toBe('new value');
//     await waitForValid(container.querySelector('label')!, 'text');
//   },
//   textarea: async ({ container }) => {
//     const element = container.querySelector('textarea') as HTMLTextAreaElement;
//     expect(element).toBeDefined();
//     userEvent.type(element, 'new value');
//     expect(element.value).toBe('new value');
//     await waitForValid(container.querySelector('label')!, 'textarea');
//   },
//   toggle: async ({ container }) => {
//     const element = container.querySelector('input') as HTMLInputElement;
//     expect(element?.getAttribute('type')).toBe('checkbox');
//     expect(element.checked).toBe(false);
//     userEvent.click(element);
//     expect(element.checked).toBe(true);
//     await waitForValid(container.querySelector('label')!, 'toggle');
//   },
// };

// const keys = Object.keys(fieldMap) as FmlRegisteredFieldControls[];

// const testCases = keys.map((k) => ({
//   config: fieldMap[k] as FmlFieldConfiguration<any>,
//   assertion: assertionMap[k],
// }));

// it.each(testCases)(
//   'renders the appropriate type of field based on configuration',
//   async ({ config, assertion }) => {
//     const foo = render(
//       <Field config={config as FmlFieldConfiguration<never>} />,
//     );

//     await assertion(foo);
//   },
// );
