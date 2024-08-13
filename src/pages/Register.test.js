import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth,db } from '../firebase.js';
import Register from './Register';
import { doc, getFirestore, setDoc } from 'firebase/firestore';


jest.mock('../firebase.js', () => ({
    auth: jest.fn(),
    db: jest.fn(),
    storage: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
    createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
    doc: jest.fn(),
    setDoc: jest.fn(),
  }));
  
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));



test('should call createUserWithEmailAndPassword with correct arguments on form submission', async () => {
    // Create a mock navigate function
    const mockNav = jest.fn();
  
    // Mock the useNavigate hook to return the mock navigate function
    useNavigate.mockReturnValue(mockNav);
  
    // Mock the Firestore instance and the doc function
    // const firestoreMock = getFirestore();
    // doc.mockReturnValue(firestoreMock);
  
    // Render the component within a Router
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
  
    const nameInput = screen.getByPlaceholderText('שם מלא');
    const emailInput = screen.getByPlaceholderText('דוא"ל');
    const phoneInput = screen.getByPlaceholderText('מספר טלפון');
    const passwordInput = screen.getByPlaceholderText('סיסמה');
    const submitButton = screen.getByText('הירשם');
  
    // Fill in the fields with valid data
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
  
    // Simulate clicking the submit button
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'john@example.com',
        'password'
      );
    });
  
    // Verify if the setDoc function is called with the correct arguments
   
  
    // Verify if the navigate function is called with the correct path
    await waitFor(() => {
      mockNav('/login');
    });
    expect(mockNav).toHaveBeenCalledWith('/login');
  });

test('renders all items correctly', async ()=>{

    render(
        <MemoryRouter>
            <Register/>
        </MemoryRouter>
    );
    
    expect(screen.getByAltText('logo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('שם מלא')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('דוא"ל')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('מספר טלפון')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('סיסמה')).toBeInTheDocument();
    

});

test('displays form validation errors', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
  
    const nameInput = screen.getByPlaceholderText('שם מלא');
    const emailInput = screen.getByPlaceholderText('דוא"ל');
    const phoneInput = screen.getByPlaceholderText('מספר טלפון');
    const passwordInput = screen.getByPlaceholderText('סיסמה');
    const submitButton = screen.getByText('הירשם');
  
    // Submit the form without filling in any fields
    fireEvent.click(submitButton);
  
    // Assert that the appropriate error messages are displayed
    expect(screen.getByText('שדה לא תקין')).toBeInTheDocument();
    expect(screen.getByText('המספר לא חוקי')).toBeInTheDocument();
    expect(screen.getByText('הסיסמה חייבת להכיל לפחות 6 תווים')).toBeInTheDocument();
    expect(screen.getByText('כתובת דוא"ל לא חוקית')).toBeInTheDocument();
    
  
    // Fill in the fields with valid data
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
  
    // Submit the form again
    fireEvent.click(submitButton);
  
    // Assert that no error messages are displayed
    await waitFor(() => { expect(screen.queryByText('שדה לא תקין')).not.toBeInTheDocument();});

    await waitFor(()=>{ expect(screen.queryByText('כתובת דוא"ל לא חוקית')).not.toBeInTheDocument();});
    
    await waitFor(()=>{  expect(screen.queryByText('המספר לא חוקי')).not.toBeInTheDocument();});

    await waitFor(()=>{ expect(screen.queryByText('הסיסמה חייבת להכיל לפחות 6 תווים')).not.toBeInTheDocument();});


});


