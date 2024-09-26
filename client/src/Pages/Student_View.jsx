import React, {  useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Navigation from "../Components/Navigation";

import ViewStudents from "./ViewStudents";
function StudentView() {
  const [user,setUser]=useState(()=>{
      const savedItem= localStorage.getItem("Logged in User")
      const parsedItem= JSON.parse(savedItem)
      return parsedItem ||"" //Returns the parsed item or null if nothing exists
  });


  const student_username=user.username;


  return (
    <div>
      <Header />
      <Navigation />
      <div>
        <h1>Welcome {student_username}</h1>

      </div>
      <div>
        <ViewStudents />
      </div>
      <Footer />
    </div>
  );
}
export default StudentView;
