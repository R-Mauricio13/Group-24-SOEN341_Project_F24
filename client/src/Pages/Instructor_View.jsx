import React, {  useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
//import Navigation from "../Components/Navigation";

import ViewStudents from "./ViewStudents";
import ViewTeams from "./ViewTeams";
import CreateTeams from "./TeamCreation";

import '../Styles/ToggleButton.css';
import PEERS_SUMMARY from "./Peers_Summary";
import PEERS_DETAILED from "./Peers_Detailed";

function InstructorView() {
  const [user]=useState(()=>{
      const savedItem= localStorage.getItem("Logged in User")
      const parsedItem= JSON.parse(savedItem)
      return parsedItem ||"" //Returns the parsed item or null if nothing exists
  });

  const instructor_username= user.username;

  const [activeView, setActiveView] = useState("students");

  // get credential cookie and check if valid, and redirect to appropriate page
  fetch('http://localhost:8080/check_login', {
    method: 'GET',
    credentials: 'include'  // Include cookies
    })
    .then(response => {
        if (response.status === 200) {
          // If the user is already logged in, redirect to the appropriate page
          response.json().then(data => {
            if (data.user_role === "student") {
              window.location.href = 'Student_Login';  // already on the student page
            } else if (data.user_role === "instructor") {
              // window.location.href = 'Instructor_Login';
            }
          });
        } else {
            window.location.href = '/?error-msg=You are not logged in';
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });

  return (
    <div>
      <div style={{flex: '1' , overflow: 'auto'}}>
        <Header />
        {/*<Navigation />*/}
        <div style={{ position: 'relative' , height: '650px' }}>
          <div>
              <h1>Welcome {instructor_username}</h1>
          </div>
          <div className="toggle-navigation">
            <button className="toggle-view" onClick={() => setActiveView("students")}>View Students</button>
            <button className="toggle-view" onClick={() => setActiveView("teams")}>View Teams</button>
            <button className="toggle-view" onClick={() => setActiveView("createTeam")}>Create Team</button>
            <button className="toggle-view" onClick={() => setActiveView("peer_review_summary")}>Summary of Reviews</button>
            <button className="toggle-view" onClick={() => setActiveView("peer_review_detailed")}>Details of Reviews</button>
          </div>

          <div>
            {activeView === "students" && <ViewStudents />}
            {activeView === "teams" && <ViewTeams />}
            {activeView === "createTeam" && <CreateTeams />}
            {activeView === "peer_review_summary" && <PEERS_SUMMARY />}
            {activeView === "peer_review_detailed" && <PEERS_DETAILED />}
          </div>
        </div>  
        <Footer />
      </div>
    </div>
  );
}
export default InstructorView;