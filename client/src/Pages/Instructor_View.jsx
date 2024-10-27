import React, {  useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Navigation from "../Components/Navigation";

import ViewStudents from "./ViewStudents";
import CreateTeams from "./TeamCreation";

function InstructorView() {
  const [user,setUser]=useState(()=>{
      const savedItem= localStorage.getItem("Logged in User")
      const parsedItem= JSON.parse(savedItem)
      return parsedItem ||"" //Returns the parsed item or null if nothing exists
  });

  const instructor_username = user.username;
  
  return (
    <div>
      <Header />
      <Navigation />
      <div style={{ position: 'relative' , height: '400px' }}>
        <div>
            <h1>Welcome {instructor_username}</h1>
        </div>
        <div>
            <ViewStudents />
        </div>

        <div>
            <CreateTeams />  
        </div>  
      </div>  
      <Footer />
    </div>
  );
}
export default InstructorView;