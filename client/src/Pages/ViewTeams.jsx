//Outputs all teams taken from MySQL
import { useEffect, useState } from "react";


function ViewTeams(){
    const [studentRecords, setRecord] = useState([]);

    useEffect(() => {
      fetch("http://localhost:8080/students")
        .then((response) => response.json())
        .then((data) => setRecord(data))
        .catch((error) => console.log(error));
    }, []);

    //sorting by team id
    const sortedRecords = studentRecords.sort((a, b) => a.team_id - b.team_id);

    
    return ( <div className="container">
        <h1>List of Teams</h1>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Team Assigned</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">id#</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.map((student) => (
              <tr key={student.id}>
                <th scope="row">{student.team_id}</th>
                <td>{student.firstname}</td>
                <td>{student.lastname}</td>
                <td>{student.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>)
}

export default ViewTeams

