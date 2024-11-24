import React, { useState, useEffect } from "react";
import "../Styles/Header.css";
import concordiaLogo from "../Assets/concordia-logo.png";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("Logged in User"));
    if (user?.loggedin) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);  // If not logged in, set loggedIn to false
    }
  }, []);

  const logOut = () => {
    // Clear user data from localStorage
    localStorage.removeItem("Logged in User");
    setLoggedIn(false); // Update the state to reflect that the user is logged out

    // Optionally, make a logout request to the server
    fetch('http://localhost:8080/logout', {
      method: 'POST',
      credentials: 'include',
    })
    .then(response => {
      if (response.ok) {
        navigate('/login'); // Redirect to the login page after logging out
      } else {
        console.error('Logout failed');
      }
    })
    .catch(error => {
      console.error('Error during logout:', error);
    });
  };

  function returnHome() {
    navigate("/");
  } 

  return (
    <header className="header">
      <div className="headerContainer">
        <div className="logo-container">
          <button className="logo-button" onClick={returnHome}>
            <img
              src={concordiaLogo}
              alt="Concordia University Logo"
              className="logo"
            />
          </button>
        </div>
        <div className="title-container">
          <h1>Peer Assessment System</h1>
        </div>
        {!loggedIn ? (
            <div className="logout-container"><div className="disabled-logout-button">Welcome</div></div>
        ) : (
        <div className="logout-container">
          <Link to="http://localhost:8080/logout" className="logout-button" onClick={logOut}>Log out</Link>
        </div>
        )}
      </div>
    </header>
  );
};

export default Header;
