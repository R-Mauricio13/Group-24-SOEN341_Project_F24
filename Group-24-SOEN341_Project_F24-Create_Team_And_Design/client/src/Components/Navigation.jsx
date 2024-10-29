import React from 'react'
import { Link } from 'react-router-dom'
import '../Styles/Navigation.css'


const Navigation = () => (
  <nav className="navigation">
    <Link to="/" className="nav-button">Home</Link>
    <Link to="/introduction" className="nav-button">Introduction</Link>
    {/* <Link to="/login" className="nav-button">Login</Link> */}
    <Link to="/resources" className="nav-button">Resources</Link>
    <Link className="nav-button">Logout</Link>
  </nav>
);

export default Navigation;