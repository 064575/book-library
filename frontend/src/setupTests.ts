import '@testing-library/jest-dom';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
  defaults: {
    headers: {
      common: {}
    }
  }
})); 