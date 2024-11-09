/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ViewTeams from '../Pages/ViewTeams';
import '@testing-library/jest-dom/extend-expect';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

// Mock data
const mockTeams = [
    {
        group_id: 1,
        team_name: "Team Alpha",
        team_size: 4
    },
    {
        group_id: 2,
        team_name: "Team Beta",
        team_size: 3
    }
];

describe('ViewTeams Component', () => {
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        
        // Mock fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockTeams)
            })
        );
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('renders teams table with headers', async () => {
        render(
            <MemoryRouter>
                <ViewTeams />
            </MemoryRouter>
        );

        expect(screen.getByText('List of Teams')).toBeInTheDocument();
        
        // Check table headers
        expect(screen.getByText('Group ID')).toBeInTheDocument();
        expect(screen.getByText('Team Name')).toBeInTheDocument();
        expect(screen.getByText('Team Size')).toBeInTheDocument();
    });

    test('displays team data correctly', async () => {
        render(
            <MemoryRouter>
                <ViewTeams />
            </MemoryRouter>
        );
    
        await waitFor(() => {
            expect(screen.getByText('Team Alpha')).toBeInTheDocument();
        });
    
        await waitFor(() => {
            expect(screen.getByText('Team Beta')).toBeInTheDocument();
        });
    
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });
        
});