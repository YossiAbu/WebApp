import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Login, { performLogin, validateEmail } from './Login';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

const auth = getAuth();

test('renders Login form', () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
  expect(screen.getByPlaceholderText('דוא"ל')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('סיסמה')).toBeInTheDocument();
  expect(screen.getByText('התחבר')).toBeInTheDocument();
});

test('should call signInWithEmailAndPassword with correct arguments on form submission', async () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  const emailInput = screen.getByPlaceholderText('דוא"ל');
  const passwordInput = screen.getByPlaceholderText('סיסמה');
  const submitButton = screen.getByRole('button', { name: 'התחבר' });

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
  });
});

test('should validate email correctly', () => {
  // Test valid email
  expect(validateEmail('test@example.com')).toBe(true);

  // Test invalid email
  expect(validateEmail('test')).toBe(false);
});

test('should show error message on form submission with invalid email', async () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  const emailInput = screen.getByPlaceholderText('דוא"ל');
  const passwordInput = screen.getByPlaceholderText('סיסמה');
  const submitButton = screen.getByRole('button', { name: 'התחבר' });

  fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(screen.getByText('כתובת דוא"ל לא חוקית')).toBeInTheDocument();
  });
});
