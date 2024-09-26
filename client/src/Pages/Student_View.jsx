import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Navigation from "../Components/Navigation";

import ViewStudents from "./ViewStudents";
function StudentView() {
  const student = "bob";


  return (
    <div>
      <Header />
      <Navigation />
        <div>
          <h1>Welcome {student}</h1>
      
        </div>
      <div>
        <ViewStudents />
      </div>
      <Footer />
    </div>
  );
}
export default StudentView;
