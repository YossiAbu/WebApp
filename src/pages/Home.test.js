import React from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from './Home';

test('renders Home page', () => {
  render(<Home />);

  // Test if the video element is rendered
  const videoElement = screen.getByTestId('video-element');
  expect(videoElement).toBeInTheDocument();
  expect(videoElement).toHaveAttribute('src', 'video.mp4');
  expect(videoElement).toHaveAttribute('autoPlay');
  expect(videoElement).toHaveAttribute('loop');
  expect(videoElement).toHaveAttribute('playsInline');
  const mutedAttribute = videoElement.getAttribute('muted');
  expect(mutedAttribute).toBeDefined();

  // Test if the title is rendered
  const titleElement = screen.getByText('לקוחות ממליצים');
  expect(titleElement).toBeInTheDocument();

  // Test if the carousel items are rendered
  const carouselItems = screen.queryAllByTestId(/^carousel-item-/);
  expect(carouselItems.length).toBeGreaterThan(0);
  carouselItems.forEach((item) => {
    expect(item).toBeInTheDocument();
  });
});

test('renders all items in mobile view', () => {
  window.innerWidth = 500;

  render(<Home />);

  const mobileVideoElement = screen.getByTestId('video-element');
  expect(mobileVideoElement).toBeInTheDocument();
  expect(screen.getByTestId('video-element')).toHaveAttribute('src', 'videohome2.mp4');
  expect(mobileVideoElement).toHaveAttribute('autoPlay');
  expect(mobileVideoElement).toHaveAttribute('loop');
  expect(mobileVideoElement).toHaveAttribute('playsInline');
  const mutedAttribute = mobileVideoElement.getAttribute('muted');
  expect(mutedAttribute).toBeDefined();

  const titleElement = screen.getByText('לקוחות ממליצים');
  expect(titleElement).toBeInTheDocument();

  const carouselItems = screen.queryAllByTestId(/^carousel-item-/);
  expect(carouselItems.length).toBeGreaterThan(0);
  carouselItems.forEach((item) => {
    expect(item).toBeInTheDocument();
  });
});

test('carousel items display images on mobileView', () => {

  window.innerWidth = 500;

  render(<Home />);

  const carouselItems = screen.queryAllByTestId(/^carousel-item-/);
  carouselItems.forEach((item) => {
    const images = within(item).queryAllByAltText(/^[0-9]+$/);
    expect(images.length).toBeGreaterThan(0);
    images.forEach((image) => {
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src');
    });
  });
});

test('isMobileView state updates correctly', () => {
  window.innerWidth = 500;
  
  render(<Home />);
  
  expect(screen.getByTestId('video-element')).toBeInTheDocument();
  expect(screen.getByTestId('video-element')).toHaveAttribute('src', 'videohome2.mp4');

  
  window.innerWidth = 1000;
  fireEvent(window, new Event('resize'));
  
  expect(screen.getByTestId('video-element')).toBeInTheDocument();
  expect(screen.getByTestId('video-element')).toHaveAttribute('src', 'video.mp4');
});

