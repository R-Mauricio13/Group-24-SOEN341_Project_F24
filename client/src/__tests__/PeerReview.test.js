/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PeerReview from '../Pages/PeerReview';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';

describe('PeerReview Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the URL search parameters for all tests
    window.history.pushState({}, '', '/peer-review?user_id=123&user_author=JohnDoe');
    const mockUser = { username: 'testUser' };
    global.localStorage.setItem('Logged in User', JSON.stringify(mockUser));
  });

  afterEach(() => {
    jest.resetAllMocks();
  })

  it('should render the form with radio buttons and textarea fields', () => {
    render(
      <Router>
        <PeerReview />
      </Router>
    );

    expect(screen.getByPlaceholderText('Describe how well this member has communicated within the group, assisted team members in need, cooperated voluntarily, etc. (Optional):')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Describe how well this member contributed in suggesting ideas, identifying problems and approaches, gathering information, etc. (Optional):')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Describe how well this member contributed in writing reports, writing and implementing effective/good code, organising the tasks, etc. (Optional):')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Describe how well this member displayed a positive attitude, attended meetings on time, respected commitments and deadlines, etc. (Optional):')).toBeInTheDocument();
    expect(screen.getByLabelText("cooperation 3")).toBeInTheDocument();
    expect(screen.getByLabelText("conceptual 3")).toBeInTheDocument();
    expect(screen.getByLabelText("practical 3")).toBeInTheDocument();
    expect(screen.getByLabelText("work ethic 3")).toBeInTheDocument();
   
  });

  it('should not allow form submission if any required radio button is not selected', async () => {
    render(
      <Router>
        <PeerReview />
      </Router>
    );
  
    // Fill in optional comments
    fireEvent.change(screen.getByPlaceholderText('Describe how well this member has communicated within the group, assisted team members in need, cooperated voluntarily, etc. (Optional):'), { target: { value: 'Some comments' } });
  
    // Try to submit without selecting the required radio button
    const form = screen.getByTestId('peer-review-form');
    fireEvent.submit(form); // Trigger the form submission
    
  
    // Assert that the required radio buttons are invalid (not selected)
    expect(screen.getByLabelText('cooperation 3')).toBeInvalid();
    expect(screen.getByLabelText('conceptual 3')).toBeInvalid();
    expect(screen.getByLabelText('practical 3')).toBeInvalid();
    expect(screen.getByLabelText('work ethic 3')).toBeInvalid();

    // Wait for any potential requests and assert that no request was made (i.e., form should not be submitted)
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(0); // The post request should not be sent
    });
    
  });

  

  it('should submit the form when all required radio buttons are selected', async () => {
    render(
      <Router>
        <PeerReview />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Describe how well this member has communicated within the group, assisted team members in need, cooperated voluntarily, etc. (Optional):'), { target: { value: 'Some comments' } });
    fireEvent.change(screen.getByPlaceholderText('Describe how well this member contributed in suggesting ideas, identifying problems and approaches, gathering information, etc. (Optional):'), { target: { value: 'Some conceptual comments' } });
    fireEvent.change(screen.getByPlaceholderText('Describe how well this member contributed in writing reports, writing and implementing effective/good code, organising the tasks, etc. (Optional):'), { target: { value: 'Some practical comments' } });
    fireEvent.change(screen.getByPlaceholderText('Describe how well this member displayed a positive attitude, attended meetings on time, respected commitments and deadlines, etc. (Optional):'), { target: { value: 'Some work ethic comments' } });

    fireEvent.click(screen.getByLabelText("cooperation 3"));
    fireEvent.click(screen.getByLabelText("conceptual 3"));
    fireEvent.click(screen.getByLabelText("practical 3"));
    fireEvent.click(screen.getByLabelText("work ethic 3"));

    axios.post.mockResolvedValueOnce({ data: 'success' });

    const form = screen.getByTestId('peer-review-form');
    fireEvent.submit(form); // Trigger the form submission

    await waitFor( async () => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/submit_review',
        {
          concept_comment: "Some conceptual comments", 
          conceptual: "3",
          coop_comment: "Some comments", 
          cooperation: "3", 
          practical: "3", 
          practical_comment: "Some practical comments", 
          user_author: "JohnDoe", 
          user_id: "123", 
          we_comment: "Some work ethic comments", 
          work_ethic: "3"
        }
      )
    });
  });

  it('should show the confirmation page after successful form submission', async () => {
    render(
      <Router>
        <PeerReview />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Describe how well this member has communicated within the group, assisted team members in need, cooperated voluntarily, etc. (Optional):'), { target: { value: 'Some comments' } });
    fireEvent.change(screen.getByPlaceholderText('Describe how well this member contributed in suggesting ideas, identifying problems and approaches, gathering information, etc. (Optional):'), { target: { value: 'Some conceptual comments' } });
    fireEvent.change(screen.getByPlaceholderText('Describe how well this member contributed in writing reports, writing and implementing effective/good code, organising the tasks, etc. (Optional):'), { target: { value: 'Some practical comments' } });
    fireEvent.change(screen.getByPlaceholderText('Describe how well this member displayed a positive attitude, attended meetings on time, respected commitments and deadlines, etc. (Optional):'), { target: { value: 'Some work ethic comments' } });

    fireEvent.click(screen.getByLabelText("cooperation 3"));
    fireEvent.click(screen.getByLabelText("conceptual 3"));
    fireEvent.click(screen.getByLabelText("practical 3"));
    fireEvent.click(screen.getByLabelText("work ethic 3"));

    expect(screen.getByLabelText('cooperation 3')).toBeChecked();
    expect(screen.getByLabelText('conceptual 3')).toBeChecked();
    expect(screen.getByLabelText('practical 3')).toBeChecked();
    expect(screen.getByLabelText('work ethic 3')).toBeChecked();

    axios.post.mockResolvedValueOnce({ data: 'success' });

    const form = screen.getByTestId('peer-review-form');
    fireEvent.submit(form); // Trigger the form submission

    await waitFor(() => expect(window.location.pathname).toBe('/peer-review'));
  });
});