import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { userAPI } from '../UserService';
import { server } from '../../mocks/server';
import { setupStore } from '../../store/store';
import 'whatwg-fetch';

const store = setupStore();

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

describe('UserService', () => {
  it('should have the correct endpoints', () => {
    expect(userAPI.endpoints.loginUser).toBeDefined();
    expect(userAPI.endpoints.registerUser).toBeDefined();
    expect(userAPI.endpoints.verifyAccount).toBeDefined();
    expect(userAPI.endpoints.verifyQrCode).toBeDefined();
    expect(userAPI.endpoints.fetchUser).toBeDefined();
    expect(userAPI.endpoints.updateUser).toBeDefined();
    expect(userAPI.endpoints.updatePassword).toBeDefined();
    expect(userAPI.endpoints.logout).toBeDefined();
  });

  describe('fetchUser', () => {
    it('should fetch the user profile', async () => {
      const { data } = await store.dispatch(userAPI.endpoints.fetchUser.initiate());
      expect(data?.data?.user).toBeDefined();
      expect(data?.data?.user.id).toBe('1');
    });
  });

  describe('loginUser', () => {
    it('should log in a user', async () => {
      const credentials = { email: 'test@test.com', password: 'password' };
      const { data } = await store.dispatch(userAPI.endpoints.loginUser.initiate(credentials));
      expect(data?.data?.user).toBeDefined();
      expect(data?.data?.user.email).toBe(credentials.email);
    });
  });
});
