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
    test('should return status code 200', async () => {
        const mockQuery = createConnection().query;

        mockQuery.mockImplementation((sql, params, callback) => {
            callback(null, [{id: 1}]);
        });

        const response = await request(app).get('/login?username=Jimmy_Ye&password=jy&user_role=student');

        expect(response.status).toBe(302);
        expect(response.text).toBe("Found. Redirecting to http://localhost:3000/Student_Login");
    })
});

