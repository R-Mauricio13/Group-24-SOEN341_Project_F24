/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import CreateAccount from '../Pages/CreateAccount';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

describe('CreateAccount Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('handles form input changes', async () => {
        render(<MemoryRouter><CreateAccount /></MemoryRouter>);

        const usernameInput = screen.getByLabelText(/Username/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const firstNameInput = screen.getByLabelText(/First Name/i);
        const lastNameInput = screen.getByLabelText(/Last Name/i);
        const roleSelect = screen.getByLabelText(/Select your role/i);

        await userEvent.type(usernameInput, 'testuser');
        await userEvent.type(passwordInput, 'password123');
        await userEvent.type(firstNameInput, 'John');
        await userEvent.type(lastNameInput, 'Doe');
        await userEvent.selectOptions(roleSelect, 'student');

        expect(usernameInput.value).toBe('testuser');
        expect(passwordInput.value).toBe('password123');
        expect(firstNameInput.value).toBe('John');
        expect(lastNameInput.value).toBe('Doe');
        expect(roleSelect.value).toBe('student');
    });
});