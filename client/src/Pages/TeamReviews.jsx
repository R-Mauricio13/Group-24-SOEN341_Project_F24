import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
//import Navigation from "../Components/Navigation";
import { useParams, useNavigate } from "react-router-dom";

function TeamReviews() {
    const { group_id } = useParams();
    const navigate = useNavigate();
    const [teamDetails, setTeamDetails] = useState(null);
    const [members, setMembers] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                // Fetch team details
                const teamResponse = await fetch(`http://localhost:8080/student_groups/${group_id}`, {credentials: 'include',});
                
                if (!teamResponse.ok) {
                    throw new Error("Error: Team not found");
                }
                
                const teamData = await teamResponse.json();
                setTeamDetails(teamData[0]); // Assuming the response is an array
                setLoading(false);

                const teamMembersResponse = await fetch(`http://localhost:8080/student-members/${group_id}`, {credentials: 'include'});
                const teamMembersData = await teamMembersResponse.json();
                setTeamMembers(teamMembersData);
                
                // Fetch reviews of the team
                const membersResponse = await fetch(`http://localhost:8080/team_reviews/${group_id}`, {credentials: 'include'});
                const membersData = await membersResponse.json();
                setMembers(membersData);
            } catch (error) {
                setError(error.message);
                console.log(error.message);
                setLoading(false);
            }
        };

        fetchTeamData();
    }, [group_id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!teamDetails) {
        return <div>No team details available.</div>;
    }

    return (
        <div>
            <div style={{ flex: '1', overflow: 'auto' }}>
                <Header />
                {/*<Navigation />*/}
                <div style={{ position: 'relative', height: '650px', marginTop: '40px' }}>
                    <div className="VTContainer">
                        <h1>{teamDetails.team_name} : Detailed Peer Review</h1>
                        {Array.isArray(teamMembers) && teamMembers.length > 0 ? (
                            teamMembers.map((teamMember) => (
                                <div key={teamMember.user_id}> {/* Ensure user_id is unique */}
                                    <h3 style={{ border: '1px solid #a71420', width: '400px', textAlign: 'center' }}>
                                        Student: {teamMember.first_name} {teamMember.last_name}
                                    </h3>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: 'center' }} scope="col">Review Author</th>
                                                <th style={{ textAlign: 'center' }} scope="col">Cooperation</th>
                                                <th style={{ textAlign: 'center' }} scope="col">Conceptual</th>
                                                <th style={{ textAlign: 'center' }} scope="col">Practical</th>
                                                <th style={{ textAlign: 'center' }} scope="col">Work Ethic</th>
                                                <th style={{ textAlign: 'center' }} scope="col">Average</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(members) && members.length > 0 ? (
                                                <>
                                                    {members
                                                        .filter((member) => member.reviewed_first_name === teamMember.first_name) // Only show reviews for the current teamMember
                                                        .length > 0 ? ( // Check if there are any members after filtering
                                                            members
                                                                .filter((member) => member.reviewed_first_name === teamMember.first_name)
                                                                .map((filteredMember) => (
                                                                    <tr key={filteredMember.user_id}> {/* Unique key for each row */}
                                                                        <td style={{ textAlign: 'center' }}>
                                                                            {filteredMember.author_first_name} {filteredMember.author_last_name}
                                                                        </td>
                                                                        <td style={{ textAlign: 'center' }}>{filteredMember.Cooperation}</td>
                                                                        <td style={{ textAlign: 'center' }}>{filteredMember.Conceptional_Contribution}</td>
                                                                        <td style={{ textAlign: 'center' }}>{filteredMember.Practical_Contribution}</td>
                                                                        <td style={{ textAlign: 'center' }}>{filteredMember.Work_Ethic}</td>
                                                                        <td style={{ textAlign: 'center' }}>{filteredMember.average_score}</td>
                                                                    </tr>
                                                                ))
                                                        ) : (
                                                            <tr>
                                                                <td data-testid="no-review-messages" colSpan="6" style={{ textAlign: 'center', padding: '50px' }}>
                                                                    No reviews found for this member.
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                    {members
                                                        .filter((commentMember) => commentMember.reviewed_first_name === teamMember.first_name) // Only show reviews for the current teamMember
                                                        .map((commentMember) => (
                                                            <tr key={commentMember.user_id}>
                                                                <td colSpan="6">
                                                                    <div>
                                                                        <div style={{ backgroundColor:'#f9f9f9', padding:'20px', width:'auto'}}>
                                                                            <div style={{ textAlign: 'left', textDecoration:'underline'}}>
                                                                                <h5>{commentMember.author_first_name} {commentMember.author_last_name}&apos;s Insights</h5>
                                                                            </div>
                                                                            <div style={{ textAlign: 'left' }}>
                                                                                <strong>Cooperation Comment:</strong> {commentMember.coop_comment || "No comment"}
                                                                            </div>
                                                                            <div style={{ textAlign: 'left' }}>
                                                                                <strong>Conceptual Comment:</strong> {commentMember.cc_comment || "No comment"}
                                                                            </div>
                                                                            <div style={{ textAlign: 'left' }}>
                                                                                <strong>Practical Comment:</strong> {commentMember.pc_comment || "No comment"}
                                                                            </div>
                                                                            <div style={{ textAlign: 'left' }}>
                                                                                <strong>Work Ethic Comment:</strong> {commentMember.we_comment || "No comment"}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </>
                                            ) : (
                                                <tr>
                                                    <td data-testid="no-review-messages" colSpan="6" style={{ textAlign: 'center', padding: '50px' }}>
                                                        No reviews found for this member.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '50px' }}>
                                <h3>No reviews found for this team.</h3>
                            </div>
                        )}
    
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <button className="ViewButton" onClick={() => navigate(-1)}>Back</button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default TeamReviews;