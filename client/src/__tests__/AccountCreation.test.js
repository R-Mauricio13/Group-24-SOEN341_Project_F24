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

    test('successfully creates new account', async () => {
        axios.post.mockResolvedValueOnce({ data: 'success' });
        
        render(<MemoryRouter><CreateAccount /></MemoryRouter>);
    
        await userEvent.type(screen.getByLabelText(/Username/i), 'testuser');
        await userEvent.type(screen.getByLabelText(/Password/i), 'password123');
        await userEvent.type(screen.getByLabelText(/First Name/i), 'John');
        await userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
        await userEvent.selectOptions(screen.getByLabelText(/Select your role/i), 'student');
    
        const submitButton = screen.getByRole('button', { name: /create account/i });
        fireEvent.click(submitButton);
    
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:8080/create',
                {
                    username: 'testuser',
                    user_password: 'password123',
                    first_name: 'John',
                    last_name: 'Doe',
                    user_role: 'student'
                }
            );
        });
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    test('handles API error during account creation', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log');
        axios.post.mockRejectedValueOnce(new Error('API Error'));
    
        render(<MemoryRouter><CreateAccount /></MemoryRouter>);
    
        await userEvent.type(screen.getByLabelText(/Username/i), 'testuser');
        await userEvent.type(screen.getByLabelText(/Password/i), 'password123');
        await userEvent.type(screen.getByLabelText(/First Name/i), 'John');
        await userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
        await userEvent.selectOptions(screen.getByLabelText(/Select your role/i), 'student');
    
        const submitButton = screen.getByRole('button', { name: /create account/i });
        fireEvent.click(submitButton);
    
        await waitFor(() => {
            expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));
        });
    
        consoleLogSpy.mockRestore();
    });

    test('validates required fields', async () => {
        render(<MemoryRouter><CreateAccount /></MemoryRouter>);
    
        const submitButton = screen.getByRole('button', { name: /create account/i });
        fireEvent.click(submitButton);
    
        // Check if HTML5 validation is working for required fields
        const usernameInput = screen.getByLabelText(/Username/i);
        expect(usernameInput).toBeRequired();
        
        const passwordInput = screen.getByLabelText(/Password/i);
        expect(passwordInput).toBeRequired();
        
        const firstNameInput = screen.getByLabelText(/First Name/i);
        expect(firstNameInput).toBeRequired();
        
        const lastNameInput = screen.getByLabelText(/Last Name/i);
        expect(lastNameInput).toBeRequired();
        
        const roleSelect = screen.getByLabelText(/Select your role/i);
        expect(roleSelect).toBeRequired();
    });
});