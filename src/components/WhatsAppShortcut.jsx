import React from 'react';
import '../css/WhatsAppShortcut.css';
import whatsapp_logo from './whatsapp-mobile-software-icon.png'

function WhatsAppShortcut() {
  const phoneNumber = '972549196629'; // Your phone number in international format

  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  return (
    <div className="whatsapp-chat-box" onClick={handleClick}>
      <img src={whatsapp_logo} alt="WhatsApp" />
    </div>
  );
}

export default WhatsAppShortcut;
