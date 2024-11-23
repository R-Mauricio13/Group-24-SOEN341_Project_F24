/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import TeamReviews from '../Pages/TeamReviews';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';

// Polyfill global fetch (needed for axios calls)
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

describe('TeamReviews Component', () => {
  const group_id1 = '2';  // First group ID
  const group_id2 = '123';  // Second group ID
  const group_id3 = '3'; //Third group ID

  beforeEach(() => {
    // Clear previous mocks
    jest.clearAllMocks();

  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // Test for "No reviews found for this team" when there are no team members
  it('should display "No reviews found for this team" when there are no team members', async () => {
    // Mock the axios response to simulate no team members
    axios.get.mockResolvedValueOnce({
      data: {
        teamDetails: { team_name: 'Group 2' },
        teamMembers: [], // No team members
      },
    });

    // Mock the logged-in user object with group_id1
    const mockUser1 = {
      username: 'testUser1',
      group_id: group_id1, // group_id1
    };

    // Store the mock user1 in localStorage
    global.localStorage.setItem('Logged in User', JSON.stringify(mockUser1));

    // Mock the URL for team review with the group_id in the path
    window.history.pushState({}, '', `/team_reviews/${group_id1}`);

    render(
      <Router>
        <Routes>
          <Route path="/team_reviews/:group_id" element={<TeamReviews />} />
        </Routes>
      </Router>
    );

    // Wait for the "No reviews found for this team" text to be in the document
    await waitFor(() => {
      expect(screen.getByText(/No reviews found for this team/i)).toBeInTheDocument();
      console.log("No reviews found for this team");
    });
  });

  // Test for handling the error when the team is not found for mockUser2
  it('should display an error message when the team is not found for a different user', async () => {
    // Simulate an error when the team is not found (e.g., wrong group_id or no data returned)
    axios.get.mockRejectedValueOnce({
        data: {
          teamDetails: [], // No team name
          teamMembers: [], // No team members
        } 
    }, expect.objectContaining({credentials: 'include'}));

    // Mock the logged-in user object with group_id2
    const mockUser2 = {
      username: 'testUser2',
      group_id: group_id2, // group_id2
    };

    // Store the mock user2 in localStorage
    global.localStorage.setItem('Logged in User', JSON.stringify(mockUser2));

    // Mock the URL for team review with the group_id2 in the path
    window.history.pushState({}, '', `/team_reviews/${group_id2}`);

    render(
      <Router>
        <Routes>
          <Route path="/team_reviews/:group_id" element={<TeamReviews />} />
        </Routes>
      </Router>
    );

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Error: Team not found/i)).toBeInTheDocument();
    });
  });

  it('should display "No review found for this member" when the team has members but no reviews', async () => {
    // Mock the axios response to simulate a team with members but no reviews
    axios.get.mockResolvedValueOnce({
        data: {
          teamDetails: { team_name: 'Group 3' },
          teamMembers: ["S_WOOD", "G_STON", "A_RIVE"], // No team members
        },
      }
    );


    // Mock the logged-in user object with group_id1
    const mockUser3 = {
      username: 'S_WOOD',
      group_id: group_id3, // group_id1
    };
  
    // Store the mock user1 in localStorage
    global.localStorage.setItem('Logged in User', JSON.stringify(mockUser3));
  
    // Mock the URL for team review with the group_id in the path
    window.history.pushState({}, '', `/team_reviews/${group_id3}`);
  
    render(
      <Router>
        <Routes>
          <Route path="/team_reviews/:group_id" element={<TeamReviews />} />
        </Routes>
      </Router>
    );
  
    // Wait for the "No review found for this member" text to be in the document
    await waitFor(() => {
        expect(screen.getAllByTestId('no-review-messages')[0]).toHaveTextContent(/No reviews found for this member/i); // Check the first one
        console.log("No reviews found for this member");
    });
  });
});
