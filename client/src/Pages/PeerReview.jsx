import React, {  useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Navigation from "../Components/Navigation";

function PeerReview() {
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
      <h1>
        Welcome to Peer Review
      </h1>
      <Footer />
    </div>
  );
}
export default PeerReview;