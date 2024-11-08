/**
 * @jest-environment jsdom
 */

import React from 'react';
import request from "supertest"
import { render, fireEvent, cleanup } from '@testing-library/react';
import { jest } from '@jest/globals'
import Login from '../Pages/Login'
import { MemoryRouter as Router } from "react-router-dom";

describe('login test', () => {

    // const setup = () => {
    //     const utils = render(<Login />);
    //     const usernameBox = utils.getByLabelText("Username");
    //     const passwordBox = utils.getByLabelText("Password");
    // };

    // afterEach(cleanup);
    // beforeEach(() => {
    //     Object.defineProperty(global, 'window', {
    //     writable: true,
    //     value: { replace: jest.fn() }
    //     })
    // })

    test('login username and password test', async () => {
        
        // // ARRANGE
        // const { usernameBox, passwordBox } = setup();
        // const username = "Jimmy Ye";
        // const password = "jy";
        
        // await userEvent.type(usernameBox, username);
        // expect(usernameBox.value).toBe("Jimmy Ye");

        // useNavigate causes issues, when the page is not in/a router
        render(<Router><Login /></Router>);
    })
});