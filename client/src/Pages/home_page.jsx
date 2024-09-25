import React from 'react';
import Header from '../Components/Header'
import Navigation from '../Components/Navigation'
import Footer from '../Components/Footer'
import concordiaBuilding from '../Assets/concordia-building.png';
import '../Styles/home-page.css';

const HomePage = () => (
  <div className="home">
    <Header />
    <Navigation />
    <main className="content">
      <img src={concordiaBuilding} alt="Concordia Building" className="building-image" />
    </main>
    <Footer />
  </div>
);

export default HomePage;