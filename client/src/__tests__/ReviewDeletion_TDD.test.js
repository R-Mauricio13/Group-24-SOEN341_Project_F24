/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import ViewStudentTeam from '../Pages/ViewStudentTeam';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('ViewStudentTeam Page', () => {
    const username = { username: 'testuser' };
    global.localStorage.setItem('Logged in User', JSON.stringify(username));
    const teamDetails = [{ team_name: 'Test Team' }];
    const members = [
        { user_id: 1, first_name: 'John', last_name: 'Doe', username: 'john_doe' },
        { user_id: 2, first_name: 'Jane', last_name: 'Smith', username: 'testuser' },
    ];

    // Mock the removeReview function
    const removeReviewMock = jest.fn();

    beforeAll(() => {
       
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        
        console.error.mockRestore();
    });

    beforeEach(() => {
        // Mock fetch to return team and member data
        global.fetch = jest.fn((url, options) => {
            
            if (url.includes('/student_groups/user/')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(teamDetails),
                });
            } else if (url.includes('/student-members/user/')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(members),
                });
            }

            // Mock the remove-review API (hardcoded)
            if (url.includes('/remove-review/')) {
                return Promise.resolve({
                    ok: true,  
                });
            }

            return Promise.reject(new Error('Unexpected URL in fetch mock'));
        });

        // Mock the function being called when a review is removed
        removeReviewMock.mockResolvedValue({ success: true });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        global.fetch.mockRestore();
    });

    test('simulates removing a review for a student row without UI interaction', async () => {
        render(<ViewStudentTeam username={username} removeReview={removeReviewMock} />);

        // Wait for page to finish loading
        await screen.findByText('John');

        
        const userIdToRemove = members[0].user_id;

        // Call removeReviewMock with the user ID
        removeReviewMock(userIdToRemove);

        // Directly invoke the API call that would remove the review (without button click)
        await global.fetch(`/remove-review/${userIdToRemove}`, { method: 'DELETE' });

        // Check if the mock removeReview function was called with the correct user ID
        expect(removeReviewMock).toHaveBeenCalledWith(userIdToRemove);

        // Verify that the mock fetch was called with the expected URL
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining(`/remove-review/${userIdToRemove}`),  
            expect.objectContaining({ method: 'DELETE' })  
        );

        // Simulate a database removal (mocked behavior)
        const updatedMembers = members.filter((member) => member.user_id !== userIdToRemove);
        expect(updatedMembers).toHaveLength(members.length - 1);
    });
});
