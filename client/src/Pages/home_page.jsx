import React from 'react'

import CreateAccount from '../Components/CreateAccount';
import Login from '../Components/Login';
function HomePage(){
    return( 
        <>
        <div>
          <h1>Peer Assessment Site</h1>
           <div className="container">
            
            <Login></Login>
            <br></br>
            <CreateAccount></CreateAccount>
           </div>
        </div>
        </>
    )
};
export default HomePage;