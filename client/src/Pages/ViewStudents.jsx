// Outputs a list of all students
import { useEffect, useState } from "react";
import axios from 'axios';
import TeamDropdown from '../Components/TeamDropdown';
import '../Styles/ViewStudents.css'; // Import the CSS File

function ViewStudents() {
  const [studentRecords, setRecord] = useState([]);
  const [teams, setTeams] = useState([]);
  const [order, setOrder] = useState("ASCENDING");

  const sorting = (col) => {
    if (order === "ASCENDING") {
      const sorted = [...studentRecords].sort((a, b) => {
        if (typeof a[col] === "string") {
          return a[col].localeCompare(b[col]);
        } else {
          return a[col] - b[col];
        }
      });
      setRecord(sorted);
      setOrder("DESCENDING");
    } else {
      const sorted = [...studentRecords].sort((a, b) => {
        if (typeof a[col] === "string") {
          return b[col].localeCompare(a[col]);
        } else {
          return b[col] - a[col];
        }
      });
      setRecord(sorted);
      setOrder("ASCENDING");
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:8080/student-members");
        const data = await response.json();
        setRecord(data);
      } catch (error) {
        console.error("Error fetching student members:", error);
      }
    };

    fetchStudents();
  }, []);

  // Fetch teams 
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("http://localhost:8080/student_groups");
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  // Update the team name for the student
  const handleTeamAssigned = async (studentId, teamName) => {
    // Find the corresponding team ID from the teams array
    const selectedTeam = teams.find(team => team.team_name === teamName);
    const groupId = selectedTeam ? selectedTeam.group_id : null;

    // Update local state
    setRecord((prevRecords) => 
      prevRecords.map((student) =>
        student.username === studentId
          ? { ...student, team_name: teamName, group_id: groupId } 
          : student
      )
    );
    
    // Send a request to assign the team on the server
    try {
      const response = await axios.post(`http://localhost:8080/student/${studentId}/${groupId}/assign`, { group_id : groupId });
      
      if (!response.status === 200) {
        throw new Error('Failed to assign team');
      }
    } catch (error) {
      console.error("Error assigning team:", error);
    }
  };

  const showDropdown = window.location.pathname === '/Instructor_Login';

  return (
    <div className="SVContainer">
      <h1>Student List</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col" onClick={() => sorting("user_id")}>
              id#
            </th>
            <th scope="col" onClick={() => sorting("first_name")}>
              First Name
            </th>
            <th scope="col" onClick={() => sorting("last_name")}>
              Last Name
            </th>
            <th scope="col" onClick={() => sorting("group_id")}>
              Team Assigned
            </th>
            <th scope="col">
              Team Action
            </th>
          </tr>
        </thead>
        <tbody>
          {studentRecords.map((student) => (
            <tr key={student.user_id}>
              <th scope="row">{student.user_id}</th>
              <td>{student.first_name}</td>
              <td>{student.last_name}</td>
              <td>{student.team_name || 'No Team Assigned'}</td>
              <td style={{ textAlign: 'center' }}>
                {showDropdown && ( 
                  <TeamDropdown 
                    teams={teams} 
                    studentId={student.username} 
                    onTeamAssigned={handleTeamAssigned} 
                    setTeams={setTeams} 
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewStudents;
