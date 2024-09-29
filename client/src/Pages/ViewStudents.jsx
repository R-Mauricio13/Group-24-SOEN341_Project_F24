//Outputs a list of all students
import { useEffect, useState } from "react";

import '../Styles/ViewStudents.css'; // Import the CSS File

function ViewStudents() {
  const [studentRecords, setRecord] = useState([]);
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
    fetch("http://localhost:8080/students")
      .then((response) => response.json())
      .then((data) => setRecord(data))
      .catch((error) => console.log(error));
  }, []);

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
            <th scope="col"
              Team Action >
            </th>
          </tr>
        </thead>
        <tbody>
          {studentRecords.map((student) => (
            <tr key={student.id}>
              <th scope="row">{student.id}</th>
              <td>{student.first_name}</td>
              <td>{student.last_name}</td>
              <td>{student.team_name || "No Team Assigned"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewStudents;
