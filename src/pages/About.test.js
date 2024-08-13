import React from 'react';
import { render, screen } from '@testing-library/react';
import About from './About';
import '@testing-library/jest-dom/extend-expect';


test('renders the About component with the logo image with the correct image style', () => {
    render(<About />);
    expect(screen.getByAltText('about')).toBeInTheDocument();
});

test('renders all paragraphs in the About component', () => {
    render(<About />);
  
    const paragraphs = screen.getAllByText((content, element) => {
      return element.tagName.toLowerCase() === 'p';
    });
  
    expect(paragraphs.length).toBe(7);
});

