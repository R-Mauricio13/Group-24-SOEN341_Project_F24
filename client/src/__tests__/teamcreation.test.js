/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import TeamCreation from '../Pages/TeamCreation';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

describe('TeamCreation Component', () => {
    // Mock data
    const mockExistingTeams = [
        { team_name: 'Existing Team', team_size: 3 }
    ];

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Mock fetch for existing teams
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockExistingTeams)
            })
        );
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('renders team creation form correctly', () => {
        render(<MemoryRouter><TeamCreation /></MemoryRouter>);

        expect(screen.getByText('Create a Team')).toBeInTheDocument();
        expect(screen.getByLabelText(/Team Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Team Size/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create team/i })).toBeInTheDocument();
    });

    test('handles team name input and size selection', async () => {
        render(<MemoryRouter><TeamCreation /></MemoryRouter>);

        const teamNameInput = screen.getByLabelText(/Team Name/i);
        const teamSizeSelect = screen.getByLabelText(/Team Size/i);

        await userEvent.type(teamNameInput, 'New Team');
        await userEvent.selectOptions(teamSizeSelect, '4');

        expect(teamNameInput.value).toBe('New Team');
        expect(teamSizeSelect.value).toBe('4');
    });
    
    test('successfully creates new team', async () => {
        axios.post.mockResolvedValueOnce({ data: 'success' });
        
        render(<MemoryRouter><TeamCreation /></MemoryRouter>);

        const teamNameInput = screen.getByLabelText(/Team Name/i);
        const teamSizeSelect = screen.getByLabelText(/Team Size/i);
        const submitButton = screen.getByRole('button', { name: /create team/i });

        await userEvent.type(teamNameInput, 'New Team');
        await userEvent.selectOptions(teamSizeSelect, '4');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:8080/Create_Team',
                {
                    team_name: 'New Team',
                    team_size: 4
                }
            );
        });
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/Instructor_Login');
        });
    });

    test('handles API error during team creation', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log');
        axios.post.mockRejectedValueOnce(new Error('API Error'));

        render(<MemoryRouter><TeamCreation /></MemoryRouter>);

        const teamNameInput = screen.getByLabelText(/Team Name/i);
        const submitButton = screen.getByRole('button', { name: /create team/i });

        await userEvent.type(teamNameInput, 'New Team');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));
        });

        consoleLogSpy.mockRestore();
    });

    test('fetches existing teams on component mount', async () => {
        render(<MemoryRouter><TeamCreation /></MemoryRouter>);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/student_groups');
        });
    });
});