import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../Styles/ViewTeams.css';

function Peers_Detailed(){
    const [studentRecords, setRecord] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8080/student_groups", {credentials: 'include'})
            .then((response) => response.json())
            .then((data) => setRecord(data))
            .catch((error) => console.log(error));
    }, []);

    // Grouping students by group_id and preparing team data
    const groupedRecords = studentRecords.reduce((acc, student) => {
        const { group_id, team_name, team_size } = student;

        if (!acc[group_id]) {
            acc[group_id] = {
                team_name: team_name, // Assuming team_name is part of the data
                team_size: team_size
            };
        }
        return acc;
    }, {});

    
    // Function to handle viewing the team
    const handleTeamReviews = (group_id) => {
        console.log(`Viewing team: ${group_id}`);
        navigate(`/team-reviews/${group_id}`);
    };

    return (
        <div className="VTContainer">
            <h1>List of Teams</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Group ID</th>
                        <th scope="col">Team Name</th>
                        <th scope="col">Team Size</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(groupedRecords).map(([group_id, teamData]) => (
                        <tr key={group_id}>
                            <td>{group_id}</td>
                            <td>{teamData.team_name}</td>
                            <td style={{ textAlign: 'left' }}>{teamData.team_size}</td>
                            <td style={{ textAlign: 'center' }}>
                                <button class="ViewButton" style={{width:'155px'}} onClick={() => handleTeamReviews(group_id)}>
                                    View Peer Reviews
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Peers_Detailed;