import React from 'react'
import logo from '../logo.jpg';

const Footer = () => {
  return (

    <footer className="footer ">
        <div className="footer-left col-md-4 col-sm-6">
            <p className="about"></p>
            <div className="icons">
                <a href="https://www.facebook.com/galosh4189?mibextid=LQQJ4d"><i className="bi bi-facebook"></i></a>
                <a href="https://www.instagram.com/gal.laviii/?igshid=YmMyMTA2M2Y%3D"><i className="bi bi-instagram"></i></a>
                <a href= "https://www.tiktok.com/@gal.laviii?_t=8bxVWwrqX2I&_r=1"><i className='bi bi-tiktok'></i></a>
            </div>
        </div>
        <div className="footer-center col-md-4 col-sm-6">
            <div><i className='bi bi-envelope'></i><p>test@gmail.com</p></div>
            <div><i className="bi bi-phone"></i><p>0549196629</p></div>
            <div><i className="bi bi-pin-map"></i><p>באר שבע</p></div>
        </div>
        <div className="footer-right col-md-4 col-sm-6">
            <img className='footer-logo' src= {logo} alt='/' style={{ width: "200px", height: "100px", margin: "10px", padding: "10px"}}></img>
            <p className="menu">
      {/* <a href="#"> Home</a> |
      <a href="#"> About</a> |
      <a href="#"> Services</a> |
      <a href="#"> Portfolio</a> |
      <a href="#"> News</a> |
      <a href="#"> Contact</a> */}
    </p>
    
  </div>
</footer>
  )
}

export default Footer