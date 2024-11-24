// src/__mocks__/axios.js
const mockAxios = {
    post: jest.fn(),
    get: jest.fn(),
    create: jest.fn(function () {
        return mockAxios; // Return the same mocked axios instance
    }),
    defaults: {
        headers: {
            common: {}
        }
    }
};

export default mockAxios;