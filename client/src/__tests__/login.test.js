/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, fireEvent, cleanup, screen, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import Login from '../Pages/Login';
import { MemoryRouter as Router } from "react-router-dom";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

const replace = window.location.replace;
const href = window.location.href;

// Mock global fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({}),
    })
);

beforeEach(() => {
    // Mock window.location.replace before each test
    Object.defineProperty(window, 'location', {
        writable: true,
        value: { replace: jest.fn(), href: href },
    });
});

afterEach(() => {
    // Cleanup mocks after each test
    jest.clearAllMocks();
    cleanup();
});

describe('login test', () => {
    test('login form fully filled', async () => {
        // ARRANGE
        render(<Router><Login /></Router>);
        const username = "Jimmy_Ye";
        const password = "jy";
        const role = "student";
        const usernameBox = screen.getByLabelText("Username");
        const passwordBox = screen.getByLabelText("Password");
        const submitButton = screen.getByRole("button", { name: /login/i });
        const userRole = screen.getByLabelText("Select your role");

        userEvent.type(usernameBox, 'Jimmy_Ye');
        userEvent.type(passwordBox, 'jy');
        userEvent.selectOptions(userRole, "student");

        // ACT
        fireEvent.click(submitButton);

        // ASSERT
        expect(usernameBox.value).toBe(username);
        expect(passwordBox.value).toBe(password);
        expect(userRole.value).toBe(role);
        expect(submitButton).not.toBeDisabled(); 

        await waitFor(() => {
            expect(window.location.replace).toHaveBeenCalledTimes(1);
            expect(window.location.replace).toHaveBeenCalledWith(
                "http://localhost:8080/login?username=Jimmy_Ye&user_password=jy&user_role=student"
            );
        });
    });

    test('login form missing username', async () => {
        // ARRANGE
        render(<Router><Login /></Router>);
        const password = "jy";
        const role = "instructor";
        const passwordBox = screen.getByLabelText("Password");
        const submitButton = screen.getByRole("button", { name: /login/i });
        const userRole = screen.getByLabelText("Select your role");

        userEvent.type(passwordBox, 'jy');
        userEvent.selectOptions(userRole, "instructor");

        // ACT
        // ASSERT
        expect(passwordBox.value).toBe(password);
        expect(userRole.value).toBe(role);
        expect(submitButton).toBeDisabled(); 
    });

    test('login form missing password', async () => {
        // ARRANGE
        render(<Router><Login /></Router>);
        const username = "Jimmy_Ye";
        const role = "instructor";
        const usernameBox = screen.getByLabelText("Username");
        const submitButton = screen.getByRole("button", { name: /login/i });
        const userRole = screen.getByLabelText("Select your role");

        userEvent.type(usernameBox, "Jimmy_Ye");
        userEvent.selectOptions(userRole, "instructor");

        // ACT
        // ASSERT
        expect(usernameBox.value).toBe(username);
        expect(userRole.value).toBe(role);
        expect(submitButton).toBeDisabled(); 
    });

    test('login form missing role', async () => {
        // ARRANGE
        render(<Router><Login /></Router>);
        const username = "Jimmy_Ye";
        const password = "jy";
        const usernameBox = screen.getByLabelText("Username");
        const passwordBox = screen.getByLabelText("Password");
        const submitButton = screen.getByRole("button", { name: /login/i });

        userEvent.type(usernameBox, "Jimmy_Ye");
        userEvent.type(passwordBox, 'jy');

        // ACT
        // ASSERT
        expect(usernameBox.value).toBe(username);
        expect(passwordBox.value).toBe(password);
        expect(submitButton).toBeDisabled();
    });
});