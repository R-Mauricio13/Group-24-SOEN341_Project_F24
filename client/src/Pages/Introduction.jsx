import React from 'react';
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import Navigation from '../Components/Navigation'
import '../Styles/Introduction.css'

const Introduction = () => (
  <div className="introduction-page">
    <Header />
    <Navigation />
    <div className="main-content">
      <div className="content">
        <h1>Welcome to the Peer Assessment System</h1>
        <p>Develop your teamwork skills through practice, experience, and reflection.</p>
        <div className="info-cards">
          <div className="card">
            <h2>Purpose</h2>
            <p>Rate the strengths and weaknesses of your team members objectively.</p>
          </div>
          <div className="card">
            <h2>Process</h2>
            <p>Reflect on the entire group work exercise and provide fair assessments.</p>
          </div>
        </div>
        <button className="ca-button">Start Assessment</button>
      </div>
    </div>
    <Footer />
  </div>
);

export default Introduction;