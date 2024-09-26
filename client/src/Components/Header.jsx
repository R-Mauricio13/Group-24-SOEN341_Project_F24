import React from "react";
import "../Styles/Header.css";
import concordiaLogo from "../Assets/concordia-logo.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
  let navigate = useNavigate();

  function returnHome() {
    navigate("/");
  }

  return (
    <header className="header">
      <div className="container">
        <div className="logo-container">
          <button className="logo-container" onClick={returnHome}>
            <img
              src={concordiaLogo}
              alt="Concordia University Logo"
              className="logo"
            />
          </button>
          <h1>Welcome to the Peer Assessment System</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
