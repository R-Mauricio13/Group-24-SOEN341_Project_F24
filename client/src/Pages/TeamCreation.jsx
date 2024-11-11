import React, { useState, useEffect } from 'react';
import '../Styles/TeamCreation.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeamCreation = () => {
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
        const teamExists = retreived_teams.some((team) => team.team_name === team_created.team_name);

        if (teamExists) {
            setMessage(`Team name already exists. Please choose a different name.`)
        }
        else {
            try {
                await axios.post("http://localhost:8080/Create_Team", team_created)
                navigate("/Instructor_Login");
                setMessage(`Team "${team_created.team_name}" with a maximum size of ${team_created.team_size} member(s) has been created!`);
                console.log(team_created)
            }
            catch (err) {
                console.log(err)
            }
        }
    }

    return (
        <div className="TCContainer" style={{ maxWidth: '300px', margin: 'auto' }}>
            <h2 className="highlight">Create a Team</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="TCLabel">
                        Team Name
                        <input
                            className="TCPrompt"
                            type="text"
                            name="team_name"
                            placeholder="Enter Team Name"
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label className="TCLabel">
                        Team Size
                        <select
                            className="TCPrompt"
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
                <button type="submit" className="TCButton">Create Team</button>
            </form>
            {message && <p className="TCMessage">{message}</p>}
        </div>
    );
};

export default TeamCreation;