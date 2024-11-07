import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ViewStudentTeam({ username }) { // Accept username as a prop
    const [teamDetails, setTeamDetails] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                // Fetch team details based on username
                const teamResponse = await fetch(`http://localhost:8080/student_groups/user/${username}`);

                if (!teamResponse.ok) {
                    throw new Error("Team not found");
                }

                const teamData = await teamResponse.json();
                setTeamDetails(teamData); // Assuming the response is an array
                setLoading(false);

                // Fetch members of the team
                const membersResponse = await fetch(`http://localhost:8080/student-members/user/${username}`);
                if (!membersResponse.ok) {
                    throw new Error("Failed to fetch members");
                }

                const membersData = await membersResponse.json();
                setMembers(membersData);
            } catch (error) {
                console.error("Error fetching team data:", error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchTeamData();
    }, [username]);

    function handleAssessButton(user_id) {
        console.log(`Viewing peer review`);
        navigate(`/Peer_Review/user?user_id=${user_id}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    
    return (
            <div>
                <div style={{flex: '1' , overflow: 'auto'}}>
                    <div style={{ position: 'relative' , height: '650px' }}>
                        <div className="VTContainer">
                            <h1> {teamDetails && teamDetails.length > 0 ? teamDetails[0].team_name : "None"}</h1>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">First Name</th>
                                        <th scope="col">Last Name</th>
                                        <th scope="col">Peer Review</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {Array.isArray(members) && members.length > 0 ? (
                                    members.map(member => (
                                            <tr key={member.user_id}>
                                                <td style={{ textAlign: 'center' }}>{member.first_name}</td>
                                                <td style={{ textAlign: 'center' }}>{member.last_name}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    {member.username != username && (
                                                      <button className="ViewButton" style={{width: '140px'}} onClick={() => handleAssessButton(member.user_id)}>Assess Member</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))

                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center' }}>No members found for this team.</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div> 
                </div>
            </div>
    );
}

export default ViewStudentTeam;