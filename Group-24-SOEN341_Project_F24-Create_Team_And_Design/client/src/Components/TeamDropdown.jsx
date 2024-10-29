import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import React, {useState, useEffect} from 'react';
import axios from 'axios';



const TeamDropdown = ({ teams = [], studentId, onTeamAssigned, setTeams }) => {

  const handleAddMember = (teamName) => {
    console.log(`Adding member ${studentId} to team ${teamName}`); 
    axios.post("http://localhost:8080/addMemberToTeam", {
      team_name: teamName,
      username: studentId
    })
    .then(response => {
      console.log('Response:', response.data); 
      alert(response.data); 
      onTeamAssigned(studentId, teamName);
      fetchUpdatedTeams();
    })
    .catch(error => {
      console.error("Error response:", error.response.data); 
      if (error.response) {
        
        alert("Error: " + error.response.data.message || error.response.statusText);
      } else if (error.request) {
        
        alert("Error: No response from server");
      } else {
        
        alert("Error: " + error.message);
      }
    });
  };

  const fetchUpdatedTeams = () => {
    axios.get("http://localhost:8080/student_groups")
      .then(response => {
        setTeams(response.data); 
      })
      .catch(error => {
        console.error("Error fetching updated teams:", error);
      });
  };
  
    return (
      <DropdownButton
        variant="default"
        id={`dropdown-basic-${studentId}`}
        title="Assign Team"
        onSelect={handleAddMember}
      >
        {teams.map((team) => (
            <Dropdown.Item key={team.team_name} eventKey={team.team_name}>  
            (Max Size: {team.team_size}) {team.team_name}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    );
  };
  
  export default TeamDropdown;