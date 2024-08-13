import React, { useState, useEffect } from 'react';
import { Row, Container, Carousel, Col } from 'react-bootstrap';
import Video from '../videoes/video.mp4';
import MobileVideo  from '../videoes/videohome2.mp4';
import rec1 from './rec1.jpg';
import '../css/home.css';

function Home() {
  const recommendations = [rec1, rec1, rec1, rec1];
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Container fluid className="ghc">
      <Row className="justify-content-center align-items-center glrw">
        {isMobileView ? (
          <video
            className="gl-hr mobile-video"
            src={MobileVideo}
            autoPlay
            muted
            loop
            playsInline
            data-testid="video-element"
          />
        ) : (
          <video
            className="gl-hr"
            src={Video}
            autoPlay
            muted
            loop
            playsInline
            data-testid="video-element"
          />
        )}
      </Row>
      <Row className="pt-5 min-vh-100 pb-3">
        <h2 className="display-4">לקוחות ממליצים</h2>
        <div className="carousel-container">
          <Carousel
            className="carousel slide mx-auto hecl"
            id="galCarousel"
            data-testid = 'home-carousel'
          >
            {Array(Math.ceil(recommendations.length / (isMobileView ? 1 : 3)))
              .fill()
              .map((_, index) => (
                <Carousel.Item key={index} data-testid={`carousel-item-${index}`}>
                  <Row className="justify-content-center align-items-center">
                    {recommendations
                      .slice(index * (isMobileView ? 1 : 3), index * (isMobileView ? 1 : 3) + (isMobileView ? 1 : 3))
                      .map((img, imgIndex) => (
                        <Col
                          key={imgIndex}
                          xs={12}
                          sm={isMobileView ? 12 : 9}
                          md={isMobileView ? 12 : 4}
                          className="d-flex justify-content-center"
                        >
                          <img className="glrc" src={img} alt={`${index * (isMobileView ? 1 : 3) + imgIndex}`} />
                        </Col>
                      ))}
                  </Row>
                </Carousel.Item>
              ))}
          </Carousel>
        </div>
      </Row>
    </Container>
  );
}

export default Home;