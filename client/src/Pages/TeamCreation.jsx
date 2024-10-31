import React, { useState, useEffect } from 'react';
import '../Styles/TeamCreation.css'; // Import the CSS File
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const TeamCreation = () => {
    //Getting Student_Groups to store in array 'retrieved_teams'
    const [retreived_teams, setTeam] = useState([])
    useEffect(() => {
        fetch("http://localhost:8080/student_groups")
            .then((response) => response.json())
            .then((data) => setTeam(data))
            .catch((error) => console.log(error));
    }, [])


    const [message, setMessage] = useState('');
    const [team_created, setNewTeam] = useState({
        team_name: "",
        team_size: 1,
    });


    const navigate = useNavigate()



    const handleChange = (event) => {
        const { name, value } = event.target;

        setNewTeam((prev) => ({ ...prev, [name]: name === "team_size" ? Number(value) : value }));
    }
    const handleSubmit = async e => {
        e.preventDefault()
        // Check if the team name already exists
        const teamExists = retreived_teams.some((team) => team.team_name === team_created.team_name);

        if (teamExists) {
            setMessage(`Team name already exists. Please choose a different name.`)

        }
        else {
            try {
                await axios.post("http://localhost:8080/Create_Team", team_created)
                navigate("/Instructor_Login");
                setMessage(`Team "${team_created.team_name}" with a maximum size of ${team_created.team_size} member(s) has been created!`);
                //Api call to post team into /Create_Team

                console.log(team_created)
            }
            catch (err) {
                console.log(err)
            }
        }
    }

    return (
        <div class="TCContainer" style={{ maxWidth: '300px', margin: 'auto' }}>
            <h2 class="highlight">Create a Team</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label class="TCLabel">
                        Team Name
                        <input
                            class="TCPrompt"
                            type="text"
                            name="team_name"
                            placeholder="Enter Team Name"
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label class="TCLabel">
                        Team Size
                        <select
                            class="TCPrompt"
                            name="team_size"
                            value={team_created.team_size}
                            onChange={handleChange}
                        >
                            {[1, 2, 3, 4, 5, 6].map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <button type="submit" class="TCButton">Create Team</button>
            </form>
            {message && <p class="TCMessage">{message}</p>}
        </div>
    );
};

export default TeamCreation;