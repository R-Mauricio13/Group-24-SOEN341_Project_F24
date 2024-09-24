import React, { useState } from 'react';

const TeamCreation = () => {
    const [teamName, setTeamName] = useState('');
    const [teamSize, setTeamSize] = useState(1);
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (teamName && teamSize > 0) {
            setMessage(`Team "${teamName}" with ${teamSize} members created!`);
        } else {
            setMessage('Please provide a valid team name and size.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto' }}>
            <h2>Create a Team</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Team Name:
                        <input 
                            type="text" 
                            value={teamName} 
                            onChange={(e) => setTeamName(e.target.value)} 
                            required 
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Team Size:
                        <select 
                            value={teamSize} 
                            onChange={(e) => setTeamSize(Number(e.target.value))}
                        >
                            {[1, 2, 3, 4, 5].map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <button type="submit">Create Team</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default TeamCreation;
