/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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
        await act(async () => {
            render(
                <MemoryRouter>
                    <ViewTeams />
                </MemoryRouter>
            );
        });

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
    

    test('handles view team button click', async () => {
        render(
            <MemoryRouter>
                <ViewTeams />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText('View Team')).toHaveLength(2);
        });

        const viewButtons = screen.getAllByText('View Team');
        fireEvent.click(viewButtons[0]);

        expect(mockNavigate).toHaveBeenCalledWith('/teams/1');
    });

    test('handles fetch error gracefully', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log');
        global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));
    
        render(
            <MemoryRouter>
                <ViewTeams />
            </MemoryRouter>
        );
    
        await waitFor(() => {
            expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));
        });
    
        consoleLogSpy.mockRestore();
    });

    test('renders empty table when no teams exist', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve([])
            })
        );
    
        render(
            <MemoryRouter>
                <ViewTeams />
            </MemoryRouter>
        );
    
        await waitFor(() => {
            const table = screen.getByRole('table');
            expect(table).toBeInTheDocument();
        });
    
        await waitFor(() => {
            const rows = screen.getAllByRole('row');
            expect(rows.length).toBe(1);
        });
    });
});