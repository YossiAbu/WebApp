import React, { useState} from 'react';
import {  useNavigate } from 'react-router-dom';
import {  createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from "firebase/firestore";
import { Container, Row, Col } from 'react-bootstrap';
import image from '../components/GalzLogo.png';
import { validateEmail } from './Login';


const Register = () => {

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone,setPhone] = useState('');
    const role = 'admin';

    const [nameError,setNameError] = useState('');
    const [showNameError, setShowNameError] =  useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [showPhoneError, setShowPhoneError] = useState(false);
    const [emailError,setEmailError] = useState('');
    const [showEmailError, setShowEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [showPasswordError, setShowPasswordError] = useState(false);

    const navigate = useNavigate();


    const formValidation = ()=>{
        if(name.length === 0){
            setNameError('שדה לא תקין');
            setShowNameError(true);
        }
        if(!validateEmail(email)){
            setEmailError('כתובת דוא"ל לא חוקית');
            setShowEmailError(true);
        }
        if(phone.length !== 10){
            setPhoneError('המספר לא חוקי');
            setShowPhoneError(true);
        }
        if(password.length<6){
            setPasswordError('הסיסמה חייבת להכיל לפחות 6 תווים');
            setShowPasswordError(true);
        }
    }

    const handleSubmit = async (e)=>{

        e.preventDefault();
        formValidation();
        try{
            const newUser = await createUserWithEmailAndPassword(auth,email,password);
            // Adding the new user to users collection
            await setDoc(doc(db,"users",newUser.user.uid),{name,email,phone,role})
            setName("");
            setEmail("");
            setPhone("");
            setPassword("");
        
            navigate("/login");
        
            // Reset form validation errors
            setNameError("");
            setShowNameError(false);
            setEmailError("");
            setShowEmailError(false);
            setPhoneError("");
            setShowPhoneError(false);
            setPasswordError("");
            setShowPasswordError(false);
          
        }catch(error){
            // const errorCode = error.code;
            // const errorMessage = error.message;
            // console.log(errorCode, errorMessage);
        
        };
        
    };

    return (
        <Container className='min-vh-100 pb-3 fr-container'>
            <div className='form-logo'>
                <img src={image} alt="logo"/>
            </div>
            <Row className='justify-content-center'>
                <Col sm={10}>
                    <form className='g-login' action='#' >
                        <div className="form-floating mb-4 position-relative">
                            <input
                                type="text"
                                id="name2"
                                className={`form-control custom-input ${showNameError ? 'is-invalid' : ''}`}
                                onChange={(e) => {
                                setName(e.target.value);
                                setShowNameError(false);
                                }}
                                value={name}
                                placeholder='שם מלא'
                                style={{ outline: 'none' }}
                                //  isInvalid={showNameError}
                            />
                            {showNameError && <div className="invalid-feedback position-absolute feedback-smaller">{nameError}</div>}
                        </div>
                        <div className='form-floating mb-4 position-relative'>
                            <input
                                type="email"
                                id="email2"
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
                        <div className="form-floating mb-4 position-relative">
                            <input
                                type="phone"
                                id="phone2"
                                className={`form-control custom-input ${showPhoneError ? 'is-invalid' : ''}`}
                                onChange={(e) => {
                                setPhone(e.target.value);
                                setShowPhoneError(false);
                                }}
                                value={phone}
                                placeholder='מספר טלפון'
                                style={{ outline: 'none' }}
                                //  isInvalid={showNameError}
                            />
                            {showPhoneError && <div className="invalid-feedback position-absolute feedback-smaller">{phoneError}</div>}
                        </div>    
                        <div className="form-floating mb-4 position-relative">
                            <input
                                type="password"
                                id="password2"
                                className={`form-control custom-input ${showPasswordError ? 'is-invalid' : ''}`}
                                onChange={(e) => {
                                setPassword(e.target.value);
                                setShowPasswordError(false);
                                }}
                                value={password}
                                placeholder="סיסמה"
                                style={{ outline: 'none' }}
                                autoComplete="new-password"
                                // isInvalid={showPasswordError}
                            />
                            {showPasswordError && <div className="invalid-feedback position-absolute feedback-smaller">{passwordError}</div>}
                            </div>

                        <button className = "btn form-btn" type = 'submit' onClick = {handleSubmit}>הירשם</button>

    
                    </form>
                </Col>
            </Row>

        </Container>

    );

};

export default Register;