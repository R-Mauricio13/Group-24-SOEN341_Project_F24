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

        if (a[col] === null) return 1;
        if (b[col] === null) return -1;

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

        if (a[col] === null) return 1;
        if (b[col] === null) return -1;

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
    fetch("http://localhost:8080/students", {
      method: "GET",
      credentials: "include", // Include cookies
    })
      .then(response => {
          if (response.status === 401) {
              // alert('You are not logged in. Redirecting to login page...');
              window.location.href = '/?error-msg=You are not logged in. Please log in.';
          } else if (response.status !== 200) {
              console.error('Error:', response);
          }
          return response;
      })

      .then((response) => response.json())
      .then((data) => setRecord(data))  // HERE YOU CAN DO STUFF...
      .catch((error) => console.log(error));
  }, []);

  // Fetch teams 
useEffect(() => {
  fetch("http://localhost:8080/existingTeams") 
    .then((response) => response.json())
    .then((data) => setTeams(data))
    .catch((error) => console.log(error));
}, []);




  //features only shown on InstructorView
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
            <th scope="col" onClick={() => sorting("team_name")}>
              Team Assigned
            </th>
            {showDropdown && (
           <th scope="col">
           Team Action
          </th>)}
          </tr>
        </thead>
        <tbody>
          {studentRecords.map((student) => (
            <tr key={student.id}>
              <th scope="row">{student.user_id}</th>
              <td>{student.first_name}</td>
              <td>{student.last_name}</td>
              <td>{student.team_name || "No Team Assigned"}</td>
              <td>
              {showDropdown && ( 
                  <TeamDropdown teams={teams} studentId={student.user_id} setTeams={setTeams} setRecord={setRecord} /> //onTeamAssigned={handleTeamAssigned}
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
