import React from 'react'

import CreateAccount from '../Components/CreateAccount';
import Login from '../Components/Login';
function HomePage() {
    return (
      <>
        <div className="container">
          <h1 className="text-center">Peer Assessment Site</h1>
          
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
      </>
    );
  }
export default HomePage;