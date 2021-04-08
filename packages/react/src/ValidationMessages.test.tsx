import { render } from '@testing-library/react';
import ValidationMessages from './ValidationMessages';

it('renders all passed validation messages', () => {
  const { getByText } = render(
    <ValidationMessages
      validationMessages={['Something went wrong', 'Daggum blowed up real bad']}
    />,
  );

  expect(getByText(/something went wrong/gi)).toBeDefined();
  expect(getByText(/blowed up/gi)).toBeDefined();
});

it('renders nothing when passed zero validation messages', () => {
  const { container } = render(<ValidationMessages validationMessages={[]} />);

  expect(container.innerHTML).toBe('');
});
