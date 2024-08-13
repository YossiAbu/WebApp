import React, { useState, useEffect, useContext, useCallback } from "react";
import shortid from "shortid";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { storage } from "../firebase.js";
import { AuthContext } from "../context/AuthContext";
import { Row, Col, Container, Carousel } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import '../css/images.css';


export function getImageNames(imageUrls) {
  let imageNames = [];

  imageUrls.forEach(function (imageUrl) {
    let url = new URL(imageUrl);
    let pathname = url.pathname;
    let decodedPathname = decodeURIComponent(pathname);

    let imageName = decodedPathname.substring(decodedPathname.lastIndexOf('/') + 1);

    imageNames.push(imageName);
  });

  return imageNames;
}

export function showMessage(message) {
  const messageElement = document.createElement('p');
  messageElement.textContent = message;

  const messageContainer = document.getElementById('messageContainer');
  messageContainer.innerHTML = '';
  messageContainer.appendChild(messageElement);
}

export default function Images() {

  // Image upload
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);

  // User's role
  const { currentUser } = useContext(AuthContext);
  const [isConditionMet, setIsConditionMet] = useState(false);

  // Editing Images
  const [isListView, setIsListView] = useState(() => {
    const storedValue = localStorage.getItem('isListView');
    return storedValue !== null ? JSON.parse(storedValue) : false;
  });

  const [selectedImages, setSelectedImages] = useState([]);

  const checkCondition = useCallback(() => {
    if (currentUser && currentUser.role === 'admin') {
      setIsConditionMet(true);
    } else {
      setIsConditionMet(false);
      setIsListView(false);
    }
  }, [currentUser, setIsConditionMet]);

  useEffect(() => {
    checkCondition();
  }, [checkCondition]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const imagesListRef = ref(storage, 'images/');
        const response = await listAll(imagesListRef);
        const urlsPromises = response.items.map((item) => getDownloadURL(item));
        const urls = await Promise.all(urlsPromises);
        setImageUrls(urls);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching images:', error);
      }
    };

    fetchData();
    localStorage.setItem('isListView', JSON.stringify(isListView));
  }, [isListView, imageUploaded]);

  async function uploadFile() {
    if (!imageUpload) return;

    const fileName = `${imageUpload.name}-${shortid.generate()}`;
    const imageRef = ref(storage, `images/${fileName}`);
    console.log(imageUpload);

    try {
      const snapshot = await uploadBytes(imageRef, imageUpload);
      console.log(snapshot);
      console.log(snapshot.ref);

      const url = await getDownloadURL(snapshot.ref);
      setImageUrls((prev) => [...prev, url]);
      setImageUploaded(!imageUploaded);
      setImageUpload(null);
    } catch (error) {
      console.log(error);
    }
  }

  function toggleView() {
    setIsListView(!isListView);
    window.location.reload();
  }

  function handleCheckboxChange(index) {
    const updatedSelectedImages = [...selectedImages];
    const selectedIndex = updatedSelectedImages.indexOf(index);

    if (selectedIndex === -1) {
      updatedSelectedImages.push(index);
    } else {
      updatedSelectedImages.splice(selectedIndex, 1);
    }

    setSelectedImages(updatedSelectedImages);
  }

  async function deleteFile() {
    if (selectedImages.length > 0) {
      let deleteImages = imageUrls.filter(function (_, index) {
        return selectedImages.includes(index);
      });

      const deletePromises = getImageNames(deleteImages).map((imageUrl) => {
        const imageRef = ref(storage, 'images/' + imageUrl);
        return deleteObject(imageRef);
      });

      try {
          await Promise.all(deletePromises);
          showMessage('עריכה נשמרה');
          setTimeout(() => {
            window.location.reload();
          }, 100);
      } catch (error) {
        console.log(error);
      }
    } else {
      showMessage('לא נבחרו תמונות');
    }
  }




  return (
    <Container fluid data-testid= "images-component">
      <Row>
        <div className="min-vh-100 pb-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>
              {isListView ? (
                <ul>
                  {imageUrls.map((url, index) => (
                    <li key={index} className="image-list-item" style={{ listStyleType: 'none' }} data-testid={`image-list-item-${index}`}>
                      <div className="image-wrapper">
                        <img src={url} alt="img" className="rounded mx-auto d-block image" />
                        <input
                          type="checkbox"
                          checked={selectedImages.includes(index)}
                          onChange={() => handleCheckboxChange(index)}
                          className="checkbox"
                          data-testid={`checkbox-${index}`}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <Row>
                  <Col>
                    <Carousel className="carousel slide mx-auto rescl" id="galCarousel">
                      {imageUrls.map((url, index) => (
                        <Carousel.Item key={index} className="g-item" data-testid={`ResCarousel-item-${index}`}>
                          <img className="d-block w-100  glrsi" src={url} alt="img" />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </Col>
                </Row>
              )}
            </div>
          )}
        </div>
      </Row>
      <Row>
        {isConditionMet && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="file"
                data-testid="browse"
                className="form-control custom-input"
                id="inputGroupFile04"
                aria-describedby="inputGroupFileAddon04"
                aria-label="Browse"
                onChange={(event) => {
                  setImageUpload(event.target.files[0]);
                  checkCondition();
                }}
              />
              <button className="btn gal-btn" type="button" onClick={uploadFile} id="inputGroupFileAddon04">
                העלה תמונה
              </button>
            </div>
            <button type="button" className="btn gal-btn" onClick={toggleView} aria-label="dispbtn">
              {isListView ? 'תצוגה' : 'עריכה'}
            </button>
            {isListView && <button className="btn gal-btn" onClick={deleteFile} aria-label="deletebtn">מחק</button>}
          </div>
        )}
      </Row>
      <div id="messageContainer"></div>
    </Container>
  );
}