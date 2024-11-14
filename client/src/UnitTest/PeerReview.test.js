/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor, cleanup, act } from '@testing-library/react';
import PeerReview from '../Pages/PeerReview';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import '@testing-library/jest-dom';

describe('PeerReview Component', () => {
  let mockAxios;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    console.log("Mock setup complete");
    // Mock the URL search parameters for all tests
    window.history.pushState({}, '', '/peer-review?user_id=123&user_author=JohnDoe');
    const mockUser = { username: 'testUser' };
    global.localStorage.setItem('Logged in User', JSON.stringify(mockUser));

    // mockAxios.onPost('http://localhost:8080/submit_review').reply((config) => {
    //   console.log("Request made with data:", config.data);  // Log the request data
    //   return [200, review];
    // });
    mockAxios.onPost('http://localhost:8080/submit_review').reply(200, { success: true });
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('should render the form with radio buttons and textarea fields', () => {
    render(
      <Router>
        <PeerReview />
      </Router>
    );

    expect(screen.getByPlaceholderText('Cooperation Comments (Optional):')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Conceptual Contribution Comments (Optional):')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Practical Contribution Comments (Optional):')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Work Ethic Comments (Optional):')).toBeInTheDocument();
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
    fireEvent.change(screen.getByPlaceholderText('Cooperation Comments (Optional):'), { target: { value: 'Some comments' } });
  
    // Try to submit without selecting the required radio button
    // fireEvent.click(screen.getByText('Submit Review'));
    const form = screen.getByTestId('peer-review-form');
    fireEvent.submit(form); // Trigger the form submission
    
  
    // Assert that the required radio buttons are invalid (not selected)
    expect(screen.getByLabelText('cooperation 3')).toBeInvalid();
    expect(screen.getByLabelText('conceptual 3')).toBeInvalid();
    expect(screen.getByLabelText('practical 3')).toBeInvalid();
    expect(screen.getByLabelText('work ethic 3')).toBeInvalid();

    // Wait for any potential requests and assert that no request was made (i.e., form should not be submitted)
    await waitFor(() => {
      expect(mockAxios.history.post).toHaveLength(0); // The post request should not be sent
    });
    
  });

  

  it('should submit the form when all required radio buttons are selected', async () => {
    render(
    <Router>
      <PeerReview />
    </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Cooperation Comments (Optional):'), { target: { value: 'Some comments' } });
    fireEvent.change(screen.getByPlaceholderText('Conceptual Contribution Comments (Optional):'), { target: { value: 'Some conceptual comments' } });
    fireEvent.change(screen.getByPlaceholderText('Practical Contribution Comments (Optional):'), { target: { value: 'Some practical comments' } });
    fireEvent.change(screen.getByPlaceholderText('Work Ethic Comments (Optional):'), { target: { value: 'Some work ethic comments' } });

    fireEvent.click(screen.getByLabelText("cooperation 3"));
    fireEvent.click(screen.getByLabelText("conceptual 3"));
    fireEvent.click(screen.getByLabelText("practical 3"));
    fireEvent.click(screen.getByLabelText("work ethic 3"));

    const form = screen.getByTestId('peer-review-form');
    fireEvent.submit(form); // Trigger the form submission

    console.log(mockAxios.history.post);

    await waitFor(() => {
      // Log the length of the mockAxios POST requests
      console.log("Length of mockAxios.history.post:", mockAxios.history.post.length);
      expect(mockAxios.history.post.length).toBe(1);
    }, {timeout: 10000 });
  });

  it('should show the confirmation page after successful form submission', async () => {
    act(() => {
      render(
      <Router>
        <PeerReview />
      </Router>
      );
    });

    fireEvent.change(screen.getByPlaceholderText('Cooperation Comments (Optional):'), { target: { value: 'Some comments' } });
    fireEvent.change(screen.getByPlaceholderText('Conceptual Contribution Comments (Optional):'), { target: { value: 'Some conceptual comments' } });
    fireEvent.change(screen.getByPlaceholderText('Practical Contribution Comments (Optional):'), { target: { value: 'Some practical comments' } });
    fireEvent.change(screen.getByPlaceholderText('Work Ethic Comments (Optional):'), { target: { value: 'Some work ethic comments' } });

    fireEvent.click(screen.getByLabelText("cooperation 3"));
    fireEvent.click(screen.getByLabelText("conceptual 3"));
    fireEvent.click(screen.getByLabelText("practical 3"));
    fireEvent.click(screen.getByLabelText("work ethic 3"));

    expect(screen.getByLabelText('cooperation 3')).toBeChecked();
    expect(screen.getByLabelText('conceptual 3')).toBeChecked();
    expect(screen.getByLabelText('practical 3')).toBeChecked();
    expect(screen.getByLabelText('work ethic 3')).toBeChecked();

    mockAxios.onPost('http://localhost:8080/submit_review').reply(200, { success: true });

    const form = screen.getByTestId('peer-review-form');
    fireEvent.submit(form); // Trigger the form submission

    await waitFor(() => expect(window.location.pathname).toBe('/Peer_Review_Confirmation'));
  });
});
