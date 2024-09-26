import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Navigation from "../Components/Navigation";
import Sidebar from "../Components/Sidebar";
import ViewStudents from "../Components/ViewStudents";
function StudentView() {
  const student = "bob";
  return (
    <div>
      <Header />
      <Navigation />
      <div>
        <h1>Welcome {student}</h1>
        <Sidebar />
        <ViewStudents/>
      </div>
      <Footer />
    </div>
  );
}
export default StudentView;
