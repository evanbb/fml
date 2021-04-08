import { waitFor, fireEvent, render } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import Form from './Form';

it('does not allow to submit if form is invalid', async () => {
  const submitSpy = jest.fn();
  const { getByText } = render(
    <Form<string>
      config={{
        control: 'text',
        defaultValue: '',
        label: 'test value',
        validators: [
          { validator: 'required', message: 'please enter a value' },
        ],
      }}
      formName='test-form'
      onSubmit={submitSpy}
      submitText='Submit my form'
    />,
  );

  const submitButton = getByText('Submit my form');

  fireEvent.click(submitButton);

  expect(submitSpy).not.toHaveBeenCalled();

  const label = getByText('test value');

  userEvents.type(label, 'something');

  await waitFor(() => label.getAttribute('data-fml-validity') === 'valid');

  // jsdom consoles an error during submit, but callback is still called by react
  // which is what we want to test - we can safely ignore these jsdom errors
  const { error } = console
  console.error = jest.fn()

  fireEvent.click(submitButton);

  // restore the original console.error
  console.error = error

  expect(submitSpy).toHaveBeenCalledTimes(1);
  expect(submitSpy).toHaveBeenCalledWith('something', expect.any(Object));
});
