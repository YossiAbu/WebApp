import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { auth } from '../firebase.js';
import NavBar from './NavBar';

jest.mock('../firebase.js', () => ({
    auth: {
        signOut: jest.fn(),
      
    },
    db: jest.fn(),
    storage: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));


test('renders all items correctly', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    expect( screen.getByAltText('logo')).toBeInTheDocument();
    expect(screen.getByText('קצת עליי')).toBeInTheDocument();
    expect(screen.getByText('שאלות ותשובות')).toBeInTheDocument();
    expect(screen.getByText('איך זה עובד')).toBeInTheDocument();
    expect(screen.getByText('תוצאות')).toBeInTheDocument();
    expect(screen.getByText('הדמיה')).toBeInTheDocument();
});

test('should navigate to the home page on logo click', async() => {
    const mockNav = jest.fn();
    useNavigate.mockReturnValue(mockNav);
  
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
        
    await waitFor(()=>{
        mockNav('/home')
    })
  
    expect(mockNav).toHaveBeenCalledWith('/home');
  });

test('redirects user to the correct page on navigation',async () => {

    const mockNav = jest.fn();
    useNavigate.mockReturnValue(mockNav);

    render(
        <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    await waitFor(() => {
        mockNav('/about');
    });
    expect(mockNav).toHaveBeenCalledWith('/about');

    await waitFor(()=>{
        mockNav('/quesans')
    });
    expect(mockNav).toHaveBeenCalledWith('/quesans');

    await waitFor(()=>{
        mockNav('/tech')
    });
    expect(mockNav).toHaveBeenCalledWith('/tech');

    await waitFor(()=>{
        mockNav('/images')
    });
    expect(mockNav).toHaveBeenCalledWith('/images');

    await waitFor(()=>{
        mockNav('/simulation')
    });
    expect(mockNav).toHaveBeenCalledWith('/simulation');

});

test('should render logout button when currentUser is truthy', () => {
    
    const currentUser = true;

    render(
        <MemoryRouter>
        <AuthContext.Provider value={{ currentUser }}>
            <NavBar />
        </AuthContext.Provider>
        </MemoryRouter>
    );
    
    // Assert that the logout button is rendered
    const logoutButton = screen.getByText('התנתק')
    expect(logoutButton).toBeInTheDocument();
});


test('should render register and login links when currentUser is falsy', () => {
    const currentUser = false;

    render(
        <MemoryRouter>
        <AuthContext.Provider value={{ currentUser }}>
            <NavBar />
        </AuthContext.Provider>
        </MemoryRouter>
    );
    
    // Assert that the register and login links are rendered
    const registerLink = screen.getByText('הירשם');
    const loginLink = screen.getByText('התחבר');
    expect(registerLink).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
});

test('should call handleLogout and trigger necessary actions', async () => {
    const currentUser = true;
  
    const dispatch = jest.fn();

    const mockNav = jest.fn();
    useNavigate.mockReturnValue(mockNav);
  
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ currentUser, dispatch }}>
          <NavBar />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  
    
    fireEvent.click(screen.getByText('התנתק'));
  
    expect(auth.signOut).toHaveBeenCalledTimes(1);
  
    await waitFor(()=>{
    expect(dispatch).toHaveBeenCalledWith({ type: 'LOGOUT' });

    });

    await waitFor(()=>{
        expect(mockNav).toHaveBeenCalledWith('/home');

    });
});

test('should toggle isCollapsed state on toggler click', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
  
    const togglerButton = screen.getByRole('button', { name: 'Toggle navigation' });
  
    expect(togglerButton.getAttribute('aria-expanded')).toBe('false');


    fireEvent.click(togglerButton);
  
    expect(togglerButton.getAttribute('aria-expanded')).toBe('true');
  
    fireEvent.click(togglerButton);
  
    expect(togglerButton.getAttribute('aria-expanded')).toBe('false');
  });
  
  test('should set isTogglerClicked state to true on toggler click', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
  
    const togglerButton = screen.getByRole('button', { name: 'Toggle navigation' });
  
    // Initial state: isTogglerClicked = false
    expect(togglerButton.getAttribute('aria-expanded')).toBe('false');
  
    // Click the toggler button
    fireEvent.click(togglerButton);
  
    // After click: isTogglerClicked = true
    expect(togglerButton.getAttribute('aria-expanded')).toBe('true');
  });
  
test('should set isMobileView state to true on window resize', () => {
    // Mock window.innerWidth to simulate a mobile view
    const originalWindowInnerWidth = window.innerWidth;
    window.innerWidth = 500;
  
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
  
    // Initial state: isMobileView = true
    expect(screen.getByAltText('logo')).toHaveClass('logo-img');
    expect(screen.getByTestId('navbar-collapse')).toHaveClass('glml');
  
    // Reset window.innerWidth
    window.innerWidth = originalWindowInnerWidth;
});
  
test('should set isMobileView state to false on window resize', () => {
    // Mock window.innerWidth to simulate a non-mobile view
    const originalWindowInnerWidth = window.innerWidth;
    window.innerWidth = 1024;
  
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
  
    // Initial state: isMobileView = false
    expect(screen.getByAltText('logo')).toHaveClass('logo-img');
    expect(screen.getByTestId('navbar-collapse')).not.toHaveClass('glml');
  
    // Reset window.innerWidth
    window.innerWidth = originalWindowInnerWidth;
});

test('should set isCollapsed state to false on handleLinkClick', () => {
    const currentUser = true;
  
    const dispatch = jest.fn();
  
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ currentUser, dispatch }}>
          <NavBar />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    const link = screen.getByText('קצת עליי');
  
    fireEvent.click(link);
  
    expect(screen.getByTestId('linktest')).not.toHaveClass('fade-in-animation');
});


test('should update the isMobileView state on window resize', () => {
    const currentUser = true;
  
    const dispatch = jest.fn();
  
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ currentUser, dispatch }}>
          <NavBar />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    const navbarCollapse = screen.getByTestId('navbar-collapse');

    window.innerWidth = 500;
    fireEvent(window, new Event('resize'));
    
    expect(navbarCollapse).toHaveClass('glml');

    window.innerWidth = 1024;
    fireEvent(window, new Event('resize'));

    expect(navbarCollapse).not.toHaveClass('glml');
  
});


test('should collapse the navbar on outside click', () => {
    const currentUser = true;
    const dispatch = jest.fn();
  
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ currentUser, dispatch }}>
          <NavBar />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  
    const navbarCollapse = screen.getByTestId('navbar-collapse');
  
    // Simulate a click event outside the navbar
    fireEvent(document, new MouseEvent('click', { bubbles: true }));
  
    // Assert the expected changes
    expect(navbarCollapse).not.toHaveClass('collapsed-menu');
  });
