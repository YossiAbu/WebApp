import React, { useContext, useState} from 'react';
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from '../firebase.js';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';
import { db } from '../firebase.js';
import { doc, getDoc } from "firebase/firestore";
import { Container, Row, Col } from 'react-bootstrap';
import image from '../components/GalzLogo.png';

export const performLogin = async (email, password, dispatch, navigate) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Retrieve user data from Firestore
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        dispatch({ type: 'LOGIN', payload: userData });
        navigate('/home');
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('משתמש לא נמצא');
    }
  };

  export const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailPattern.test(email);
    // setShowEmailError(!isValid);
    return isValid;
  };

  
  const Login = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [showEmailError, setShowEmailError] = useState(false);
    const [password, setPassword] = useState('');
  
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
  
 
    const onLogin = async (e) => {
      e.preventDefault();
      if (!validateEmail(email)) {
        setEmailError('כתובת דוא"ל לא חוקית');
        setShowEmailError(true);
        return;
      }
      try {
        await performLogin(email, password, dispatch, navigate)
      } catch (error) {
        console.log('Login error:', error);
        setEmail('');
        setPassword('');
        setShowEmailError(true);
        setEmailError('משתמש לא נמצא');
      }
      
    };
  

    return (

        <Container className='min-vh-100 pb-3 fr-container'>
            <div className='form-logo'>
                <img src={image} alt="logo" />
            </div>
            <Row className='justify-content-center'>
                <Col  sm={10}>
                    <form className='g-login' action='#' >
                        <div className='form-floating mb-4 position-relative'>
                            <input
                                type="email"
                                id="email1"
                                className={`form-control custom-input ${showEmailError ? 'is-invalid' : ''}`}
                                onChange={(e) =>{ 
                                    setEmail(e.target.value);
                                    setShowEmailError(false);
                                }}
                                value={email}
                                placeholder='דוא"ל'
                                style={{ outline: 'none' }}
                                // isInvalid={showEmailError}
                            />
                            {showEmailError && <div className="invalid-feedback position-absolute feedback-smaller">{emailError}</div>}
                        </div>

                        <div className='form-floating mb-4 position-relative'>
                            <input
                                type="password"
                                id="password1"
                                className='form-control custom-input'
                                onChange={(e) =>{ 
                                   setPassword(e.target.value);
                                }}
                                value={password}
                                placeholder='סיסמה'
                                style={{ outline: 'none' }}
                                autoComplete='new-password'
                            />
                        </div>

                        {/* <div className='form-check mb-4 position-relative'>
                        <input
                            className='form-check-input'
                            type='checkbox'
                            id='rememberMe'
                            // checked={rememberMe}
                            // onChange={() => setRememberMe(!rememberMe)}
                        />
                        <label className='form-check-label' htmlFor='rememberMe'>זכור אותי</label>
                        </div>
                         */}
                        <button className='btn form-btn position-relative' type='button' onClick = {onLogin}>התחבר</button>
                    </form>
                </Col>
            </Row>
        </Container>
       
    );
};

export default Login;


    

