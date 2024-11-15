import React from 'react'
import { Link } from 'react-router-dom'
import '../Styles/Navigation.css'


const Navigation = () => (
  <div className="navigation">
    <Link to="/" className="nav-button">Home</Link>
    <Link to="/introduction" className="nav-button">Introduction</Link>
    {/* <Link to="/login" className="nav-button">Login</Link> */}
    <Link to="/resources" className="nav-button">Resources</Link>
    <Link to="http://localhost:8080/logout" className="nav-button">Logout</Link>
  </div>
);

export default Navigation;