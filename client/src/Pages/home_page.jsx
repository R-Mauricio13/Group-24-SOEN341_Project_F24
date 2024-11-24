import React from "react";
import Header from "../Components/Header";
//import Navigation from "../Components/Navigation";
import Footer from "../Components/Footer";
import concordiaBuilding from "../Assets/concordia-building.png";
import "../Styles/home-page.css";
import CreateAccount from "./CreateAccount";
import Login from "./Login";

const HomePage = () => (
  <div className="home">
    <Header />
    {/*<Navigation />*/}
    <div className="content z-n1">
      <img
        src={concordiaBuilding}
        alt="Concordia Building"
        className="building-image"
      />
    </div>
    <div className="container forms z-1">
      <div className="row justify-content-center">
        {/* Login Form */}
        <div className="col-md-5">
          <Login />
        </div>

        {/* Create Account Form */}
        <div className="col-md-5">
          <CreateAccount />
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default HomePage;
