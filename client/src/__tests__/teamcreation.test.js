/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import TeamCreation from '../Pages/TeamCreation';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

describe('TeamCreation Component', () => {
    // Mock data
    const mockExistingTeams = [
        { team_name: 'Existing Team', team_size: 3 }
    ];

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Mock fetch for existing teams
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockExistingTeams)
            })
        );
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

   
});