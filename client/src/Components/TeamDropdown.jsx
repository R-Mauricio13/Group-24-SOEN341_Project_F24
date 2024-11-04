import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import React, {useState, useEffect} from 'react';
import axios from 'axios';



const TeamDropdown = ({ teams = [], studentId, setTeams, setRecord }) => {
  
  const handleAddMember = (groupId) => {
    console.log(`Adding member ${studentId} to team ${groupId}`); 
    axios.post("http://localhost:8080/addMemberToTeam", {
      group_id: groupId,
      user_id: studentId
    })
    .then(response => {
      console.log('Response:', response.data); 
      alert(response.data.message); 
      fetchUpdatedStudents();
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

  const handleRemoveMember = () => {
    axios.post("http://localhost:8080/removeMemberfromTeam", {
      user_id: studentId
    })
    .then(response => {
      console.log('Response:', response.data);
      alert(response.data);
      fetchUpdatedStudents();
      fetchUpdatedTeams();
    })
    .catch(error => {
      console.error("Error response:", error.response?.data); 
      if (error.response) {
        alert("Error: " + error.response.data.message || error.response.statusText);
      } else if (error.request) {
        alert("Error: No response from server");
      } else {
        alert("Error: " + error.message);
      }
    });
  };

  const fetchUpdatedStudents = () => {
    axios.get("http://localhost:8080/students", { withCredentials: true })
      .then(response => {
        setRecord(response.data); 
      })
      .catch(error => {
        console.error("Error fetching updated teams:", error);
      });
  };

  const fetchUpdatedTeams = () => {
    axios.get("http://localhost:8080/existingTeams")
      .then(response => {
        setTeams(response.data); 
      })
      .catch(error => {
        console.error("Error fetching updated teams:", error);
      });
  };
  
    return (
      <DropdownButton
        variant="danger"
        id={`dropdown-basic-${studentId}`}
        title="Assign Team"
        onSelect={(eventKey) => {
          if (eventKey === "remove") {
            handleRemoveMember();
          } else {
            handleAddMember(eventKey);
          }
        }}
      >
         <Dropdown.Item 
         eventKey="remove">Remove from Team
         </Dropdown.Item>

         <Dropdown.Divider />
        {teams.map((team) => (
            <Dropdown.Item key={team.group_id} eventKey={team.group_id}>  
            {team.team_name} ({team.current_member}/{team.team_size})
          </Dropdown.Item>
        ))}
      </DropdownButton>
    );
  };
  
  export default TeamDropdown;