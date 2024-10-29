import React, {  useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Navigation from "../Components/Navigation";

import ViewStudents from "./ViewStudents";
import ViewTeams from "./ViewTeams";
import CreateTeams from "./TeamCreation";

import '../Styles/ToggleButton.css';

function InstructorView() {
  const [user,setUser]=useState(()=>{
      const savedItem= localStorage.getItem("Logged in User")
      const parsedItem= JSON.parse(savedItem)
      return parsedItem ||"" //Returns the parsed item or null if nothing exists
  });


  const instructor_username= user.username;

  const [activeView, setActiveView] = useState("students");

  return (
    <div>
      <div style={{flex: '1' , overflow: 'auto'}}>
        <Header />
        <Navigation />
        <div style={{ position: 'relative' , height: '650px' }}>
          <div>
              <h1>Welcome {instructor_username}</h1>
          </div>
          <div class="ToggleNavigation">
            <button class="ToggleView" onClick={() => setActiveView("students")}>View Students</button>
            <button class="ToggleView" onClick={() => setActiveView("teams")}>View Teams</button>
            <button class="ToggleView" onClick={() => setActiveView("createTeam")}>Create Team</button>
          </div>

          <div>
            {activeView === "students" && <ViewStudents />}
            {activeView === "teams" && <ViewTeams />}
            {activeView === "createTeam" && <CreateTeams />}
          </div>
        </div>  
        <Footer />
      </div>
    </div>
  );
}
export default InstructorView;