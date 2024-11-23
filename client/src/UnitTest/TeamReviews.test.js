/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import TeamReviews from '../Pages/TeamReviews';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import '@testing-library/jest-dom';

// Polyfill global fetch (needed for axios calls)
import fetch from 'node-fetch';
global.fetch = fetch

describe('TeamReviews Component', () => {
  const mockAxios = {
    post: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    defaults: {
        headers: {
            common: {}
        }
    }
  };
  
  const group_id1 = '2';
  const group_id2 = '123';
  const group_id3 = '3';

  beforeEach(() => {
    // Clear previous mocks
    mockAxios.get.mockClear();
    mockAxios.post.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should display "No reviews found for this team" when there are no team members', async () => {
    // Mock the axios response to simulate no team members
    mockAxios.get.mockResolvedValueOnce({
      data: {
        teamDetails: { team_name: 'Group 2' },
        teamMembers: [], // No team members
      },
    });
  
    const mockUser1 = {
      username: 'testUser1',
      group_id: '2',
    };
  
    global.localStorage.setItem('Logged in User', JSON.stringify(mockUser1));
    window.history.pushState({}, '', `/team_reviews/2`);
  
    render(
      <Router>
        <Routes>
          <Route path="/team_reviews/:group_id" element={<TeamReviews />} />
        </Routes>
      </Router>
    );
  
    // Wait for the "Loading..." text to disappear (if present)
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });

    // Now check for the "No reviews found for this team" message
    await waitFor(() => {
      expect(screen.getByText(/No reviews found for this team/i)).toBeInTheDocument();
    });
  });

  it('should display an error message when the team is not found for a different user', async () => {
    mockAxios.get.mockRejectedValueOnce({
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
    mockAxios.get.mockResolvedValueOnce({
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
