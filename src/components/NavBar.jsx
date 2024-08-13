import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { auth } from '../firebase.js';
import logo from './GalzLogo.png';
import '../css/navBar.css';


const NavBar = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(AuthContext);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [/*isTogglerClicked*/, setIsTogglerClicked] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    setIsTogglerClicked(true);
  };

  const handleLinkClick = () => {
    setIsCollapsed(false);
    setIsTogglerClicked(false);
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User logged out successfully');
      dispatch({ type: 'LOGOUT' });
      setIsCollapsed(false);
      setIsTogglerClicked(false);
      navigate('/home');
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
  
    const handleOutsideClick = (event) => {
      const targetElement = event.target;
    
      if (targetElement instanceof Element && targetElement.closest('.navbar') === null) {
        setIsCollapsed(false);
        setIsTogglerClicked(false);
      }
    };
  
    window.addEventListener('resize', handleResize);
    window.addEventListener('click', handleOutsideClick);
  
    handleResize(); // Initial call to handleResize
  
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []); // Empty dependency array, equivalent to componentDidMount
  


  return (
    <nav className="navbar navbar-expand-md navbar-custom sticky-top justify-content-between ">
      <div className="container-fluid">

      <button
            className="navbar-toggler"
            type="button"
            onClick={handleToggle}
            data-bs-toggle="collapse"
            data-bs-target="#glnbr"
            aria-controls="glnbr"
            aria-expanded={isCollapsed ? 'true' : 'false'}
            aria-label="Toggle navigation"
            data-testid = "navbar-btn"
          >
            <span className="navbar-toggler-icon"></span>
      </button>
      <Link className="navbar-brand" to="/home">
            <img src={logo} alt="logo" className="logo-img" />
      </Link>
        
      
       
        <div
          className={`collapse navbar-collapse ${isCollapsed ? 'collapsed-menu' : ''} ${isMobileView ? 'glml ':''}`}
          id="glnbr"
          style={{transition: '0.08s ease',}}
          data-testid="navbar-collapse"
        >
          <ul className="navbar-nav ml-auto mb-10 mb-lg-0">
            <li className={`nav-item ${isCollapsed ? 'fade-in-animation delay-0' : ''} `} data-testid = "linktest">
              <Link className="nav-link" to="/about" onClick={handleLinkClick}>
                קצת עליי
              </Link>
            </li>
            <li className={`nav-item ${isCollapsed ? 'fade-in-animation delay-0' : ''} `}>
              <Link className="nav-link" to="/tech" onClick={handleLinkClick}>
                איך זה עובד
              </Link>
            </li>
            <li className={`nav-item ${isCollapsed ? 'fade-in-animation delay-1' : ''}`}>
              <Link className="nav-link" to="/quesans" onClick={handleLinkClick}>
                שאלות ותשובות
              </Link>
            </li>
            <li className={`nav-item ${isCollapsed  ? 'fade-in-animation delay-1' : ''}`}>
              <Link className="nav-link" to="/images" onClick={handleLinkClick}>
                תוצאות
              </Link>
            </li>
            <li className={`nav-item ${isCollapsed  ? 'fade-in-animation delay-2' : ''} `}>
              <Link className="nav-link" to="/simulation" onClick={handleLinkClick}>
                הדמיה
              </Link>
            </li>
            {currentUser ? (
              <li className={`nav-item ${isCollapsed  ? 'fade-in-animation delay-3' : ''} `}>
                <Link to="/" className="nav-link" onClick={handleLogout}>
                  התנתק
                </Link>
              </li>
            ) : (
              <>
                <li className={`nav-item ${isCollapsed  ? 'fade-in-animation delay-3' : ''}`}>
                  <Link to="/register" className="nav-link" onClick={handleLinkClick}>
                    הירשם
                  </Link>
                </li>
                <li className={`nav-item ${isCollapsed  ? 'fade-in-animation delay-3' : ''}`}>
                  <Link to="/login" className="nav-link" onClick={handleLinkClick}>
                    התחבר
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;