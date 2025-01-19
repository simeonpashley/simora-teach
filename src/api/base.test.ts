/* eslint-disable no-restricted-globals */
import { ApiError, BaseApiClient } from './base';

// Create a concrete implementation of BaseApiClient for testing
class TestApiClient extends BaseApiClient {
  public async testRequest<T>(endpoint: string, options = {}) {
    return this.request<T>(endpoint, options);
  }

  public testBuildQueryParams(params: Record<string, unknown>) {
    return this.buildQueryParams(params);
  }
}

describe('BaseApiClient', () => {
  let client: TestApiClient;
  let originalFetch: typeof global.fetch;
  let originalURL: typeof global.URL;

  beforeEach(() => {
    client = new TestApiClient('/test-api');
    originalFetch = global.fetch;
    originalURL = global.URL;

    // Mock URL constructor to handle test cases
    global.URL = jest.fn((url, base) => {
      const baseUrl = base || '';
      const fullUrl = baseUrl + url;
      const searchParams = new Map<string, string>();

      const urlObject = {
        toString: () => {
          const params = Array.from(searchParams.entries())
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
          return params ? `${fullUrl}?${params}` : fullUrl;
        },
        get href() {
          return this.toString();
        },
        searchParams: {
          append: (key: string, value: string) => {
            searchParams.set(key, value);
          },
        },
      };

      return urlObject as unknown as URL;
    }) as unknown as typeof URL;

    // Reset window.location.origin for consistent testing
    Object.defineProperty(window, 'location', {
      value: { origin: 'http://localhost:3000' },
      writable: true,
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    global.URL = originalURL;
    jest.restoreAllMocks();
  });

  describe('request method', () => {
    it('should make a GET request with correct URL and headers', async () => {
      const mockResponse = { data: { id: 1, name: 'Test' } };
      global.fetch = jest.fn().mockImplementation((url: URL | string, _init?: RequestInit) => {
        expect(url.toString()).toBe('http://localhost:3000/test-api/users');
        expect(_init).toEqual(expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }));

        return Promise.resolve({
          ok: true,
          headers: {
            get: () => 'application/json',
          },
          json: () => Promise.resolve(mockResponse),
        });
      });

      const result = await client.testRequest('/users');

      expect(result).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should make a POST request with body', async () => {
      const requestBody = { name: 'Test User' };
      const mockResponse = { data: { id: 1, ...requestBody }, pagination: { total: 1, totalPages: 1 } };
      global.fetch = jest.fn().mockImplementation((url: URL | string, init?: RequestInit) => {
        expect(url.toString()).toBe('http://localhost:3000/test-api/users');
        expect(init).toEqual(expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }));

        return Promise.resolve({
          ok: true,
          headers: {
            get: () => 'application/json',
          },
          json: () => Promise.resolve(mockResponse),
        });
      });

      const result = await client.testRequest('/users', {
        method: 'POST',
        body: requestBody,
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should handle query parameters correctly', async () => {
      const mockResponse = { data: { results: [] } };
      global.fetch = jest.fn().mockImplementation((url: URL | string, init?: RequestInit) => {
        expect(url.toString()).toBe('http://localhost:3000/test-api/users?page=1&limit=10&search=test&active=true');
        expect(init).toEqual(expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }));

        return Promise.resolve({
          ok: true,
          headers: {
            get: () => 'application/json',
          },
          json: () => Promise.resolve(mockResponse),
        });
      });

      await client.testRequest('/users', {
        params: {
          page: 1,
          limit: 10,
          search: 'test',
          active: true,
        },
      });

      expect(global.fetch).toHaveBeenCalled();
    });

    it('should handle API errors correctly', async () => {
      const errorResponse = {
        error: 'Not Found',
        status: 404,
      };
      global.fetch = jest.fn().mockImplementation((_url: URL | string, _init?: RequestInit) => {
        return Promise.resolve({
          ok: false,
          status: 404,
          headers: {
            get: () => 'application/json',
          },
          json: () => Promise.resolve(errorResponse),
        });
      });

      try {
        await client.testRequest('/nonexistent');
        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error).toMatchObject({
          message: 'Not Found',
          status: 404,
        });
      }
    });

    it('should handle custom headers', async () => {
      const mockResponse = { data: { id: 1 } };
      global.fetch = jest.fn().mockImplementation((url: URL | string, init?: RequestInit) => {
        expect(url.toString()).toBe('http://localhost:3000/test-api/users');
        expect(init).toEqual(expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer token123',
            'X-Custom-Header': 'custom-value',
          },
        }));

        return Promise.resolve({
          ok: true,
          headers: {
            get: () => 'application/json',
          },
          json: () => Promise.resolve(mockResponse),
        });
      });

      await client.testRequest('/users', {
        headers: {
          'Authorization': 'Bearer token123',
          'X-Custom-Header': 'custom-value',
        },
      });

      expect(global.fetch).toHaveBeenCalled();
    });

    it('should handle server-side rendering (window undefined)', async () => {
      const mockResponse = { data: { id: 1 }, pagination: { total: 1, totalPages: 1 } };
      const originalWindow = global.window;
      delete (global as any).window;

      global.fetch = jest.fn().mockImplementation((url: URL | string, _init?: RequestInit) => {
        expect(url.toString()).toBe('http://localhost:3000/test-api/users');

        return Promise.resolve({
          ok: true,
          headers: {
            get: () => 'application/json',
          },
          json: () => Promise.resolve(mockResponse),
        });
      });

      const result = await client.testRequest('/users');

      expect(result).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalled();

      // Restore window
      (global as any).window = originalWindow;
    });
  });

  describe('buildQueryParams', () => {
    it('should build query params correctly', () => {
      const params = {
        string: 'test',
        number: 123,
        boolean: true,
        nullValue: null,
        undefinedValue: undefined,
        zero: 0,
        emptyString: '',
      };

      const result = client.testBuildQueryParams(params);

      expect(result).toEqual({
        string: 'test',
        number: '123',
        boolean: 'true',
        zero: '0',
        emptyString: '',
      });
      expect(result).not.toHaveProperty('nullValue');
      expect(result).not.toHaveProperty('undefinedValue');
    });
  });
});
