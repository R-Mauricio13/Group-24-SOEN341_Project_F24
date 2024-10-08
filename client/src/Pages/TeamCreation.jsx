import React, {useState} from 'react';
import '../Styles/TeamCreation.css'; // Import the CSS File

const TeamCreation = () => {
    const [teamName, setTeamName] = useState('');
    const [teamSize, setTeamSize] = useState(1);
    const [message, setMessage] = useState('');

    const [existingTeamNames, setExistingTeamNames] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (existingTeamNames.includes(teamName)){
            setMessage('Team name already exists. Please choose a different name.');
        } else if (teamName && teamSize > 0) {
            setExistingTeamNames([...existingTeamNames, teamName]);
            setMessage(`Team "${teamName}" with a maximum size of ${teamSize} member(s) has been created!`);
        } else {
            setMessage('Please provide a valid team name and size.');
        }
    };

    return (
        <div class = "TCContainer" style={{ maxWidth: '300px', margin: 'auto' }}>
            <h2 class="highlight">Create a Team</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label class="TCLabel">
                        Team Name
                        <input
                            class="TCPrompt"
                            type="text" 
                            placeholder="Enter Team Name"
                            value={teamName} 
                            onChange={(e) => setTeamName(e.target.value)} 
                            required 
                        />
                    </label>
                </div>
                <div>
                    <label class="TCLabel">
                        Team Size
                        <select 
                            class="TCPrompt"
                            value={teamSize} 
                            onChange={(e) => setTeamSize(Number(e.target.value))}
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