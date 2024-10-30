//Outputs a list of all students
import { useEffect, useState } from "react";
import TeamDropdown from '../Components/TeamDropdown';
import '../Styles/ViewStudents.css'; // Import the CSS File

function ViewStudents() {
  const [studentRecords, setRecord] = useState([]);
  const [teams, setTeams] = useState([]);
  const [order, setOrder] = useState("ASCENDING");

  const sorting = (col) => {
    
    console.log(order)
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
    }
    else if (order === "DESCENDING") {
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
    fetch("http://localhost:8080/student-members")
      .then((response) => response.json())
      .then((data) => setRecord(data))
      .catch((error) => console.log(error));
  }, []);

    // Fetch teams 
  useEffect(() => {
    fetch("http://localhost:8080/student_groups") 
      .then((response) => response.json())
      .then((data) => setTeams(data))
      .catch((error) => console.log(error));
  }, []);

  // Update the team name for the student
  const handleTeamAssigned = (studentId, teamName) => {
    setRecord((prevRecords) => 
        prevRecords.map((student) =>
            student.username === studentId
                ? { ...student, team_name: teamName } 
                : student
        )
    );
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
            <th scope="col" >
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
                  <TeamDropdown teams={teams} studentId={student.username} onTeamAssigned={handleTeamAssigned} setTeams={setTeams} />
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
