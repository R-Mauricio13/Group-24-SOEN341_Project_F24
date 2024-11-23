/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import TeamReviews from '../Pages/TeamReviews';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import '@testing-library/jest-dom';
import axios from 'axios';  // Import axios to mock it

// Mock axios globally at the top of the test file
jest.mock('axios'); // This tells Jest to mock axios

describe('TeamReviews Component', () => {
  const group_id1 = '2';
  const group_id2 = '123';
  const group_id3 = '3';

  beforeEach(() => {
    // Clear previous mocks
    axios.get.mockClear();
    axios.post.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should display "No reviews found for this team" when there are no team members', async () => {
    // Mock the axios response to simulate no team members
    axios.get.mockResolvedValueOnce({
      data: {
        teamDetails: { team_name: 'Group 2' },
        teamMembers: [], // No team members
      },
    });

    const mockUser1 = {
      username: 'testUser1',
      group_id: group_id1,
    };

    global.localStorage.setItem('Logged in User', JSON.stringify(mockUser1));
    window.history.pushState({}, '', `/team_reviews/${group_id1}`);

    render(
      <Router>
        <Routes>
          <Route path="/team_reviews/:group_id" element={<TeamReviews />} />
        </Routes>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/No reviews found for this team/i)).toBeInTheDocument();
    });
  });

  it('should display an error message when the team is not found for a different user', async () => {
    // Mock the axios response for an error when the team is not found
    axios.get.mockRejectedValueOnce({
      data: {
        teamDetails: [], // No team name
        teamMembers: [],
      },
    });

    const mockUser2 = {
      username: 'testUser2',
      group_id: group_id2,
    };

    global.localStorage.setItem('Logged in User', JSON.stringify(mockUser2));
    window.history.pushState({}, '', `/team_reviews/${group_id2}`);

    render(
      <Router>
        <Routes>
          <Route path="/team_reviews/:group_id" element={<TeamReviews />} />
        </Routes>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error: Team not found/i)).toBeInTheDocument();
    });
  });

  it('should display "No review found for this member" when the team has members but no reviews', async () => {
    // Mock the axios response to simulate a team with members but no reviews
    axios.get.mockResolvedValueOnce({
      data: {
        teamDetails: { team_name: 'Group 3' },
        teamMembers: ['S_WOOD', 'G_STON', 'A_RIVE'], // Members, no reviews
      },
    });

    const mockUser3 = {
      username: 'S_WOOD',
      group_id: group_id3,
    };

    global.localStorage.setItem('Logged in User', JSON.stringify(mockUser3));
    window.history.pushState({}, '', `/team_reviews/${group_id3}`);

    render(
      <Router>
        <Routes>
          <Route path="/team_reviews/:group_id" element={<TeamReviews />} />
        </Routes>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('no-review-messages')[0]).toHaveTextContent(/No reviews found for this member/i);
    });
  });
});
