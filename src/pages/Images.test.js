import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Images, { getImageNames, showMessage } from './Images';
import { AuthContext } from '../context/AuthContext';
import { ref, uploadBytes,listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase.js';

jest.mock('../firebase.js', () => ({
    auth: jest.fn(),
    db: jest.fn(),
    storage: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
    // getStorage:jest.fn(),
    ref: jest.fn(),
    uploadBytes: jest.fn(),
    getDownloadURL: jest.fn(),
    listAll: jest.fn(),
    deleteObject: jest.fn(),
}));

// Mock the Location object and its reload method
beforeEach(() => {
    delete window.location;
    window.location = { reload: jest.fn() };
});
  
test('Should fetch and display images', async () => {
    
    const mockUser = {
        email: 'test@gmail.com',
        name: 'admintest',
        phone: '0504423423',
        role: 'admin',
    };

    listAll.mockResolvedValue({
        items: ['image1', 'image2', 'image3'],
    });
    
    getDownloadURL.mockImplementation((item) => Promise.resolve(`http://example.com/${item}`));

    render(
        <AuthContext.Provider value={{ currentUser: mockUser }}>
            <Images />
        </AuthContext.Provider>
    );
    
    await screen.findByText('Loading...');
    // Wait for the data fetching to complete
    await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
        
    expect(localStorage.getItem('isListView')).toBe('false');

    // Assert that the Firebase Storage functions were called correctly
    expect(ref).toHaveBeenCalledWith(storage, 'images/');
    expect(listAll).toHaveBeenCalledWith(ref(storage,'images/'));
    expect(getDownloadURL).toHaveBeenCalledTimes(3); 

    // Assert that the fetched images are displayed
    const carouselItems = screen.queryAllByTestId(/^ResCarousel-item-/);
    await waitFor(() => {
        expect(carouselItems.length).toBeGreaterThan(0);

    })
    carouselItems.forEach((item) => {
        expect(item).toBeInTheDocument();   
    });
        
});


test('Should change the images view to ListView when changeDisplay button is clicked',async () => {

    // Mock the user object
    const mockUser = {
        email: 'test@gmail.com',
        name: 'admintest',
        phone: '0504423423',
        role: 'admin',
    };

    // Mock the listAll function to return a mock response
    listAll.mockResolvedValue({
        items: ['image1', 'image2', 'image3'], // Replace with your mock image items
    });
    
    // Mock the getDownloadURL function to return a mock URL
    getDownloadURL.mockImplementation((item) => Promise.resolve(`http://example.com/${item}`));

    render(
        <AuthContext.Provider value={{ currentUser: mockUser }}>
            <Images />
        </AuthContext.Provider>
    );
    
    expect(localStorage.getItem('isListView')).toBe('false');

    const dispbtn = screen.getByLabelText('dispbtn');
    fireEvent.click(dispbtn);

    await waitFor(()=>{
        expect(localStorage.getItem('isListView')).toBe('true');
    })

    expect(window.location.reload).toHaveBeenCalled();

    await screen.findByText('Loading...');
        // Wait for the data fetching to complete
    await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    const ListViewItems = screen.queryAllByTestId(/^image-list-item-/);
    expect(ListViewItems.length).toBeGreaterThan(0);

    fireEvent.click(dispbtn);
    expect(localStorage.getItem('isListView')).toBe('false');



});


test('handles error when fetching images', async () => {
    // Mock the AuthContext value
    const mockUser = {
        email: 'test@gmail.com',
        name: 'admintest',
        phone: '0504423423',
        role: 'admin',
    };

    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();

    listAll.mockImplementation(() => {
        throw new Error('Failed to fetch images');
    });
  

    render(
        <AuthContext.Provider value={{ currentUser: mockUser }}>
            <Images />
        </AuthContext.Provider>
    );
 
    await waitFor(() => expect(consoleErrorMock).toHaveBeenCalled(), { timeout: 3000, interval: 500 });

    expect(consoleErrorMock).toHaveBeenCalledWith('Error fetching images:', new Error('Failed to fetch images'));
  
    consoleErrorMock.mockRestore();
});

test('handles checkbox change',async () => {
    // Mock the user object
    const mockUser = {
        email: 'test@gmail.com',
        name: 'admintest',
        phone: '0504423423',
        role: 'admin',
    };

    // Mock the listAll function to return a mock response
    listAll.mockResolvedValue({
        items: ['image1', 'image2', 'image3'], // Replace with your mock image items
    });
    
    // Mock the getDownloadURL function to return a mock URL
    getDownloadURL.mockImplementation((item) => Promise.resolve(`http://example.com/${item}`));

    render(
        <AuthContext.Provider value={{ currentUser: mockUser }}>
            <Images />
        </AuthContext.Provider>
    );
    
    await screen.findByText('Loading...');

    expect(localStorage.getItem('isListView')).toBe('false');

    const dispbtn = screen.getByLabelText('dispbtn');
    fireEvent.click(dispbtn);

    await waitFor(()=>{
        expect(localStorage.getItem('isListView')).toBe('true');
    })

    expect(window.location.reload).toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  
    const checkboxes = screen.getAllByRole('checkbox');
  
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0].checked).toBeTruthy();
  
    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1].checked).toBeTruthy();
  
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0].checked).toBeFalsy();

    fireEvent.click(dispbtn);
    expect(localStorage.getItem('isListView')).toBe('false');
});

test('getImageNames returns the correct image names with user selection', () => {
    const imageUrls = [
      'https://example.com/images/image1.jpg',
      'https://example.com/images/image2.jpg',
      'https://example.com/images/image3.jpg',
      'https://example.com/images/image4.jpg',
    ];
  
    const selectedImages = [1, 3]; // Indices of selected images (image2.jpg and image4.jpg)
  
    const expectedNames = ['image2.jpg', 'image4.jpg'];
  
    const result = getImageNames(
      imageUrls.filter((_, index) => selectedImages.includes(index))
    );
  
    expect(result).toEqual(expectedNames);
});


test('should not display editing elements if currentUser\'s role is "user"', async () =>{

    const mockUser = {
        email: 'test@gmail.com',
        name: 'usertest',
        phone: '0504423423',
        role: 'user',
    };

    render(
        <AuthContext.Provider value={{ currentUser: mockUser }}>
            <Images />
        </AuthContext.Provider>
    );

    expect(screen.queryByLabelText('dispbtn')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('deletebtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('browse')).not.toBeInTheDocument();
    expect(localStorage.getItem('isListView')).toBe('false');

});

test('should display error massage if no images where selected and the delete button was clicked', async () => {
    
    const reloadMock = jest.fn();

    const mockUser = {
      email: 'test@gmail.com',
      name: 'admintest',
      phone: '0504423423',
      role: 'admin',
    };
  
    listAll.mockResolvedValue({
      items: ['image1', 'image2', 'image3'],
    });
  
    getDownloadURL.mockImplementation((item) => Promise.resolve(`http://example.com/${item}`));

  
    render(
      <AuthContext.Provider value={{ currentUser: mockUser }}>
        <Images />
      </AuthContext.Provider>
    );
  
    await screen.findByText('Loading...');
  
    expect(localStorage.getItem('isListView')).toBe('false');
  
    const dispbtn = screen.getByLabelText('dispbtn');
    fireEvent.click(dispbtn);
  
    await waitFor(() => {
      expect(localStorage.getItem('isListView')).toBe('true');
    });
  
    expect(window.location.reload).toHaveBeenCalled();
  
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  
    const ListViewItems = screen.queryAllByTestId(/^image-list-item-/);
    expect(ListViewItems.length).toBeGreaterThan(0);
  

    const deleteObjectMock = jest.fn().mockResolvedValue();
    deleteObject.mockImplementation(deleteObjectMock);

    fireEvent.click(screen.getByLabelText('deletebtn'));

    
    // jest.spyOn(window, 'setTimeout').mockImplementation((fn) => fn()); 
    // jest.spyOn(window.location, 'reload').mockImplementation(reloadMock);
  
    expect(deleteObjectMock).not.toHaveBeenCalled();

    fireEvent.click(dispbtn);
    expect(localStorage.getItem('isListView')).toBe('false');

});



test('should call deleteObject if images been selected', async () => {

    const mockUser = {
      email: 'test@gmail.com',
      name: 'admintest',
      phone: '0504423423',
      role: 'admin',
    };
    
    // const reloadMock = jest.fn();
  
    listAll.mockResolvedValue({
      items: ['image1', 'image2', 'image3'],
    });
  
    getDownloadURL.mockImplementation((item) => Promise.resolve(`http://example.com/${item}`));

  
    render(
      <AuthContext.Provider value={{ currentUser: mockUser }}>
        <Images />
      </AuthContext.Provider>
    );
  
    await screen.findByText('Loading...');
  
    expect(localStorage.getItem('isListView')).toBe('false');
  
    const dispbtn = screen.getByLabelText('dispbtn');
    fireEvent.click(dispbtn);
  
    await waitFor(() => {
      expect(localStorage.getItem('isListView')).toBe('true');
    });
  
    expect(window.location.reload).toHaveBeenCalled();
  
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  
    const ListViewItems = screen.queryAllByTestId(/^image-list-item-/);
    expect(ListViewItems.length).toBeGreaterThan(0);
  
  
    fireEvent.click(screen.getByTestId('checkbox-0'));
    fireEvent.click(screen.getByTestId('checkbox-2'));

    const deleteObjectMock = jest.fn().mockResolvedValue();
    deleteObject.mockImplementation(deleteObjectMock);

    fireEvent.click(screen.getByLabelText('deletebtn'));

    // expect(window.location.reload).toHaveBeenCalled();

    
    
    expect(deleteObjectMock).toHaveBeenCalledWith(ref( storage ,'images/image1'));
    expect(deleteObjectMock).toHaveBeenCalledWith(ref( storage ,'images/image3'));
    expect(deleteObjectMock).toHaveBeenCalledTimes(2);

    

    fireEvent.click(dispbtn);
    expect(localStorage.getItem('isListView')).toBe('false');

});




test('uploads image when uploadFile is called', async () => {
    const mockUser = {
      email: 'test@gmail.com',
      name: 'admintest',
      phone: '0504423423',
      role: 'admin',
    };

    getDownloadURL.mockImplementation(() => Promise.resolve('http://example.com/test.jpg'));


    render(
      <AuthContext.Provider value={{ currentUser: mockUser }}>
        <Images />
      </AuthContext.Provider>
    );
    
    
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    const input = screen.getByLabelText('Browse');
  
    fireEvent.change(input, { target: { files: [file] } });
  
    await waitFor(() => {
      expect(screen.getByText('העלה תמונה')).toBeEnabled();
    });
  
    fireEvent.click(screen.getByText('העלה תמונה'));


    expect(ref).toHaveBeenCalledWith(storage, 'images/');
    expect(uploadBytes).toHaveBeenCalledWith(ref(storage,'images/test.png'),file);
});

