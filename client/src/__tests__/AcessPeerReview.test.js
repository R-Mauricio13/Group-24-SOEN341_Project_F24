/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import ViewStudentTeam from '../Pages/ViewStudentTeam';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('ViewStudentTeam Page', () => {
    const mockUser = { username: 'testuser' };
    global.localStorage.setItem('Logged in User', JSON.stringify(mockUser));
    const teamDetails = [{ team_name: 'Test Team' }];
    const members = [
        { user_id: 1, first_name: 'John', last_name: 'Doe', username: 'john_doe' },
        { user_id: 2, first_name: 'Jane', last_name: 'Smith', username: 'testuser' },
    ];

    const mockNavigate = jest.fn();

    beforeAll(() => {
        // Mock console.error to prevent error logs in tests
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });
    
    afterAll(() => {
        // Restore original console.error after all tests are done
        console.error.mockRestore();
    });
    

    beforeEach(() => {
        // Mock fetch to return team and member data
        global.fetch = jest.fn((url) => {
            if (url.includes('/student_groups/user/')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(teamDetails),
                });
            } else if (url.includes('/student-members/user/', {credentials: 'include'})) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(members),
                });
            }
            return Promise.reject(new Error("Unexpected URL in fetch mock"));
        });

        useNavigate.mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        global.fetch.mockRestore();
    });

    test('displays team name and members', async () => {
        render(<ViewStudentTeam username="testuser" />);
    
        // Assert team name is displayed
        expect(await screen.findByText('Test Team')).toBeInTheDocument();
    
        // Assert members are displayed
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('Jane')).toBeInTheDocument();
    
        // Check if "Assess Member" button is displayed for John
        expect(screen.getByText('Assess Member')).toBeInTheDocument();
    
        // Simulate button click and verify navigation with dynamic URL
        fireEvent.click(screen.getByText('Assess Member'));
    
        // Capture the correct dynamic URL with user_id and student_username
        const expectedUrl = `/Peer_Review/user?user_id=1&user_author=testuser`;
    
        expect(mockNavigate).toHaveBeenCalledWith(expectedUrl);
    });

    test('displays loading and error states correctly', async () => {
        // Simulate loading state
        global.fetch.mockImplementationOnce(() => new Promise(() => {})); // Make fetch hang forever

        render(<ViewStudentTeam username="testuser" />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        // Cleanup fetch mock and restore behavior for the next test
        jest.clearAllMocks();

        // Now simulate an error response from fetch
        global.fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('Error fetching data'))
        );

        render(<ViewStudentTeam username="testuser" />);

        expect(await screen.findByText('Error: Error fetching data')).toBeInTheDocument();
    });
});
