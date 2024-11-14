// src/__mocks__/axios.js
const mockAxios = {
    post: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    defaults: {
        headers: {
            common: {}
        }
    }
};

export default mockAxios;