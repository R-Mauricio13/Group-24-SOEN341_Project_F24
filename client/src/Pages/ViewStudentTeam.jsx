import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function ViewStudentTeam({ username }) { // Accept username as a prop
    const [teamDetails, setTeamDetails] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();



    const [user] = useState(() => {
        const savedItem = localStorage.getItem("Logged in User");
        const parsedItem = JSON.parse(savedItem);
        return parsedItem || ""; // Returns the parsed item or null if nothing exists
    });

    const student_username = user.username;
    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                // Fetch team details based on username
                const teamResponse = await fetch(`http://localhost:8080/student_groups/user/${username}`, {credentials: 'include'});

                if (!teamResponse.ok) {
                    throw new Error("Team not found");
                }

                const teamData = await teamResponse.json();
                setTeamDetails(teamData); // Assuming the response is an array
                // setLoading(false);

                // Fetch members of the team
                const membersResponse = await fetch(`http://localhost:8080/student-members/user/${username}`, {credentials: 'include'});
                if (!membersResponse.ok) {
                    throw new Error("Failed to fetch members");
                }

                const membersData = await membersResponse.json();
                setMembers(membersData);
            } catch (error) {
                console.error("Error fetching team data:", error);
                setError(error.message);
                // setLoading(false);
            }
        };

        fetchTeamData();
    }, [username]);


    const [reviewData, setReviewData] = useState(() => {
        fetch(`http://localhost:8080/peer_reviews`, {credentials: 'include'})
            .then((response) => {  
                if (response.ok) {
                    return response.json();
                }
                throw response;
            }).then((data) => {
                console.log("review data: ", data);
                setReviewData(data);
                setLoading(false);
                
                return data;
            }).catch((error) => {
                console.error("Error fetching review data:", error);
                setError(error.message);
                setLoading(false);
            });
    });

    function existsReview(user_id, user_author) {
        console.log("Checking if review exists for user_id: ", user_id, " and user_author: ", user_author);
        console.log("Review data: ", reviewData);
        if (reviewData) {
            for (let i = 0; i < reviewData.length; i++) {
                console.log("Review data: ", reviewData[i]);
                if (reviewData[i].user_id === user_id && reviewData[i].user_author === user_author) {
                    console.log("Review exists!");
                    return true;
                }
            }
        }
        console.log("Review does not exist.");
        return false;
    }


    function handleAssessButton(user_id) {
        console.log(`Viewing peer review`);
        navigate(`/Peer_Review/user?user_id=${user_id}&user_author=${student_username}`);
    }

    function handleDeleteButton(user_id) {
        // create popup to confirm deletion
        if (window.confirm("Are you sure you want to delete this review?")) {
            fetch("http://localhost:8080/delete_review", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: user_id, user_author: student_username }),
            })

            .then((response) => {
                if (response.ok) {
                    console.log("Evaluation deleted successfully");
                    alert("Evaluation deleted successfully");
                    window.location.reload();
                } else {
                    console.log("Failed to delete evaluation");
                    alert("Failed to delete evaluation");
                }
            });
        }
    }
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    
    return (
            <div>
                <div style={{flex: '1' , overflow: 'auto'}}>
                    <div style={{ position: 'relative' , height: '650px' }}>
                        <div className="vt-container">
                            <h1> {teamDetails && teamDetails.length > 0 ? teamDetails[0].team_name : "None"}</h1>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{textAlign: 'center'}} scope="col">First Name</th>
                                        <th style={{textAlign: 'center'}} scope="col">Last Name</th>
                                        <th style={{textAlign: 'center'}} scope="col">Peer Review</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {Array.isArray(members) && members.length > 0 ? (
                                    members.map(member => (
                                            <tr key={member.user_id}>
                                                <td style={{ textAlign: 'center' }}>{member.first_name}</td>
                                                <td style={{ textAlign: 'center' }}>{member.last_name}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                {member.username !== user.username && !existsReview(member.user_id, user.username) && (
                                                        <button className="view-button" style={{width: '140px'}} onClick={() => handleAssessButton(member.user_id)}>Assess Member</button>
                                                )}
                                                {member.username !== user.username && existsReview(member.user_id, user.username) && (
                                                    <button className="view-button" style={{width: '140px'}} onClick={() => handleAssessButton(member.user_id)}>Edit Review</button>
                                                )}
                                                {member.username !== user.username && existsReview(member.user_id, user.username) && (
                                                    <button className="view-button" style={{width: '140px'}} onClick={() => handleDeleteButton(member.user_id)}>Delete Review</button>
                                                )}
                                                    
                                                </td>
                                            </tr>
                                        ))

                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center', padding:'50px' }}>No members found for this team.</td>
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

ViewStudentTeam.propTypes = {
    username: PropTypes.string.isRequired,
};

export default ViewStudentTeam;