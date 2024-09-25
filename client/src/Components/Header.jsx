import React from 'react';
import '../Styles/Header.css'
import concordiaLogo from '../Assets/concordia-logo.png';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo-container">
          <img src={concordiaLogo} alt="Concordia University Logo" className="logo" />
          <h1>Welcome to the Peer Assessment System</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;