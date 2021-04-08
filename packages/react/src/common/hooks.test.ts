import { renderHook, act } from '@testing-library/react-hooks';
import { useFmlComponent } from './hooks';

it('validates changes asynchronously', async () => {
  const changeSpy = jest.fn();
  const focusSpy = jest.fn();

  const { result, waitForNextUpdate } = renderHook(() =>
    useFmlComponent<string>({
      controlId: 'test',
      config: {
        control: 'text',
        defaultValue: '',
        label: 'test',
        validators: [
          {
            validator: 'required',
            message: 'enter a value pretty please',
          },
        ],
      },
      onChange: changeSpy,
      onFocus: focusSpy,
    }),
  );

  act(() =>
    result.current.onChange({
      value: 'new value',
      validity: 'pending',
    }),
  );

  expect(result.current.value.validity).toBe('pending');

  await waitForNextUpdate();

  expect(result.current.value.validity).toBe('valid');

  // started as unknown, then pending, then valid
  expect(result.all.length).toBe(3);
});

it('handles race conditions with changes', async () => {
  const changeSpy = jest.fn();
  const focusSpy = jest.fn();

  const { result, waitForNextUpdate } = renderHook(() =>
    useFmlComponent<string>({
      controlId: 'test',
      config: {
        control: 'text',
        defaultValue: '',
        label: 'test',
        validators: [
          {
            validator: 'required',
            message: 'enter a value pretty please',
          },
        ],
      },
      onChange: changeSpy,
      onFocus: focusSpy,
    }),
  );

  act(() =>
    result.current.onChange({
      value: 'first',
      validity: 'pending',
    }),
  );

  act(() =>
    result.current.onChange({
      value: '',
      validity: 'pending',
    }),
  );

  act(() =>
    result.current.onChange({
      value: '',
      validity: 'pending',
    }),
  );
  act(() =>
    result.current.onChange({
      value: 'fourth',
      validity: 'pending',
    }),
  );

  expect(result.current.value.validity).toBe('pending');

  await waitForNextUpdate();

  expect(result.current.value.validity).toBe('valid');

  /**
   * started as unknown, then pending for four changes, failed
   * validations were ignored, fourth change validated successfully
   */
  expect(result.all.length).toBe(6);
});

it('returns validation messages from failed validations', async () => {
  const changeSpy = jest.fn();
  const focusSpy = jest.fn();

  const { result, waitForNextUpdate } = renderHook(() =>
    useFmlComponent<string>({
      controlId: 'test',
      config: {
        control: 'text',
        defaultValue: 'default value', // default to a valid value
        label: 'test',
        validators: [
          {
            validator: 'required',
            message: 'enter a value pretty please',
          },
        ],
      },
      onChange: changeSpy,
      onFocus: focusSpy,
    }),
  );

  act(() =>
    result.current.onChange({
      value: '',
      validity: 'pending',
    }),
  );

  await waitForNextUpdate();

  expect(result.current.validationMessages[0]).toBe('enter a value pretty please')
})

it('validates on initial blur, even if value has not changed', async () => {
  const changeSpy = jest.fn();
  const focusSpy = jest.fn();

  const { result, waitForNextUpdate } = renderHook(() =>
    useFmlComponent<string>({
      controlId: 'test',
      config: {
        control: 'text',
        defaultValue: '', // default to an invalid value
        label: 'test',
        validators: [
          {
            validator: 'required',
            message: 'enter a value pretty please',
          },
        ],
      },
      onChange: changeSpy,
      onFocus: focusSpy,
    }),
  );

  act(() =>
    result.current.onBlur(),
  );

  await waitForNextUpdate();

  expect(result.current.validationMessages[0]).toBe('enter a value pretty please')
})

it('tracks whether the user has touched a form control', async () => {
  const changeSpy = jest.fn();
  const focusSpy = jest.fn();

  const { result } = renderHook(() =>
    useFmlComponent<string>({
      controlId: 'test',
      config: {
        control: 'text',
        defaultValue: '',
        label: 'test',
      },
      onChange: changeSpy,
      onFocus: focusSpy,
    }),
  );

  act(() =>
    result.current.onFocus(),
  );

  expect(result.current.hasBeenTouched).toBe(true)
})
