/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import TeamReviews from '../Pages/TeamReviews';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import '@testing-library/jest-dom';

describe('TeamReviews Component', () => {
  const group_id1 = '2';
  const group_id2 = '123';
  const group_id3 = '3';

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
  });

  it('should display "No reviews found for this team" when there are no team members', async () => {
    // Mock the fetch response to simulate no team members

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([{ team_name: 'Group 2' }]),
  });

  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve([]),
  });

  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve([]),
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
      expect(screen.getByText(/No reviews found for this team./i)).toBeInTheDocument();
    });
  });

  it('should display an error message when the team is not found for a different user', async () => {
    // Mock the fetch response for an error when the team is not found

    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () =>
        Promise.resolve(["Error: Could not access team data"]),
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
    // Mock the fetch response to simulate a team with members but no reviews
    global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([{ team_name: 'Group 3' }]),
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve(['S_WOOD', 'G_STON', 'A_RIVE']),
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([]),
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
      expect(screen.getAllByTestId('no-review-messages')[0]).toHaveTextContent(/No reviews found for this member./i);
    });
  });
});
