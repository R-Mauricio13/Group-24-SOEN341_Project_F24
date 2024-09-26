import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/home_page";
import Introduction from "./Pages/Introduction";
import Login from "./Pages/Login";
import StudentView from "./Pages/Student_View";
import ViewTeams from "./Pages/ViewTeams";
import "bootstrap/dist/css/bootstrap.min.css";

// import Resources from './Resources';

function App() {
 
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/introduction" element={<Introduction />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Student_Login" element={<StudentView />} />
      <Route path="/Team_List" element={<ViewTeams />} />
      {/* <Route path="/resources" element={<Resources />} /> */}
    </Routes>
  );
}

export default App;
