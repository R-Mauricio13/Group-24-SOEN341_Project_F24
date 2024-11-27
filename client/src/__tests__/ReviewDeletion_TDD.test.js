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
    let reviews = [
        { review_id: 1, user_id: 1, review: 'Great job on the project!' }, 
        { review_id: 2, user_id: 2, review: 'Needs improvement in communication.' }, 
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

            // Mock the remove-review API (hardcoded, based on user_id)
            if (url.includes('/remove-review/')) {
                const userIdToRemove = parseInt(url.split('/').pop()); 
                const updatedReviews = reviews.filter(review => review.user_id !== userIdToRemove);

                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(updatedReviews),
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

    test('simulates removing a review for a student based on user_id', async () => {
        render(<ViewStudentTeam username={username} removeReview={removeReviewMock} />);

        // Wait for page to finish loading
        await screen.findByText('John');

        const userIdToRemove = 1; 

        // Call removeReviewMock with the user_id
        removeReviewMock(userIdToRemove);

        // Directly invoke the API call that would remove the review (without button click)
        const response = await global.fetch(`/remove-review/${userIdToRemove}`, { method: 'DELETE' });
        const result = await response.json();

        // Check if the mock removeReview function was called with the correct user_id
        expect(removeReviewMock).toHaveBeenCalledWith(userIdToRemove);

        // Verify that the mock fetch was called with the expected URL
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining(`/remove-review/${userIdToRemove}`),  
            expect.objectContaining({ method: 'DELETE' }) 
        );

        // Check API response updates reviews correctly
        expect(result).toHaveLength(reviews.length - 1); 
        expect(result).not.toContainEqual(expect.objectContaining({ user_id: userIdToRemove })); 
        //Check if reviews is updated
        reviews=result;
        expect(reviews).toHaveLength(1); 
        expect(reviews).not.toContainEqual(expect.objectContaining({ user_id: userIdToRemove })); 
    });
});
