//Outputs a list of all students
import { useEffect, useState } from "react";
function ViewStudents() {
  const [studentRecords, setRecord] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/students")
      .then((response) => response.json())
      .then((data) => setRecord(data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="container">
      <h1>Student List</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">id#</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Team Assigned</th>
          </tr>
        </thead>
        <tbody>
          {studentRecords.map((student, index) => (
            <tr key={index}>
              <th scope="row">{student.id}</th>
              <td>{student.firstname}</td>
              <td>{student.lastname}</td>
              <td>{student.team_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewStudents;
