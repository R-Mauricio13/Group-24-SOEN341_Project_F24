/**
 * @jest-environment jsdom
 */

import { render, fireEvent, cleanup, screen } from '@testing-library/react';
import { jest } from '@jest/globals';
import request from "supertest";
import app from "./server";
import mysql from "mysql2";
const { createConnection } = mysql;

jest.mock('mysql2', () => ({
    createConnection: jest.fn().mockReturnValue({
        query: jest.fn()
    })
}));

afterEach(cleanup);

describe("Login endpoint", () => { 
    test('test login as student', async () => {
        const mockQuery = createConnection().query;

        mockQuery.mockImplementation((sql, params, callback) => {
            callback(null, [{id: 1}]);
        });

        const response = await request(app).get('/login?username=Jimmy_Ye&password=jy&user_role=student');

        expect(response.status).toBe(302);
        expect(response.text).toBe("Found. Redirecting to http://localhost:3000/Student_Login");
    })

    test('test login as instructor', async () => {
        const mockQuery = createConnection().query;

        mockQuery.mockImplementation((sql, params, callback) => {
            callback(null, [{id: 1}]);
        });

        const response = await request(app).get('/login?username=Jimmy_Ye&password=jy&user_role=instructor');

        expect(response.status).toBe(302);
        expect(response.text).toBe("Found. Redirecting to http://localhost:3000/Instructor_Login");
    })

    test('test login with no role', async () => {
        const mockQuery = createConnection().query;

        mockQuery.mockImplementation((sql, params, callback) => {
            callback(null, [{id: 1}]);
        });

        const response = await request(app).get('/login?username=Jimmy_Ye&password=jy&user_role=');

        expect(response.status).toBe(302);
        expect(response.text).toBe("Found. Redirecting to http://localhost:3000/?error-msg=Invalid%20user%20role");
    })

    test('test login with invalid return', async () => {
        const mockQuery = createConnection().query;

        mockQuery.mockImplementation((sql, params, callback) => {
            callback(null, []);
        });

        const response = await request(app).get('/login?username=Jimmy_Y&password=jy&user_role=student');

        expect(response.status).toBe(302);
        expect(response.text).toBe("Found. Redirecting to http://localhost:3000/?error-msg=Invalid%20username%20or%20password");
    })
});

