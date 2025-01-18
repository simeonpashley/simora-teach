/* eslint-disable no-restricted-globals */
import type { Student, StudentFilters, StudentSortParams } from './students';
import { StudentsApi } from './students';
import type { PaginationParams } from './types';

describe('StudentsApi', () => {
  let api: StudentsApi;
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    api = new StudentsApi();
    originalFetch = global.fetch;

    // Reset window.location.origin for consistent testing
    Object.defineProperty(window, 'location', {
      value: { origin: 'http://localhost:3000' },
      writable: true,
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  describe('getStudents', () => {
    const mockStudents: Student[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        enrollmentDate: new Date('2024-01-01'),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: new Date('1991-01-01'),
        enrollmentDate: new Date('2024-01-01'),
        status: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should fetch students without parameters', async () => {
      global.fetch = jest.fn().mockImplementation((url: URL | string) => {
        expect(url.toString()).toBe('http://localhost:3000/api/students');

        return Promise.resolve({
          ok: true,
          headers: {
            get: () => 'application/json',
          },
          json: () => Promise.resolve({ data: mockStudents }),
        });
      });

      const result = await api.getStudents();

      expect(result).toEqual(mockStudents);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should fetch students with filters', async () => {
      const filters: StudentFilters = {
        search: 'John',
        status: 'active',
      };

      global.fetch = jest.fn().mockImplementation((url: URL | string) => {
        expect(url.toString()).toBe('http://localhost:3000/api/students?search=John&status=active');

        return Promise.resolve({
          ok: true,
          headers: {
            get: () => 'application/json',
          },
          json: () => Promise.resolve({ data: [mockStudents[0]] }),
        });
      });

      const result = await api.getStudents(filters);

      expect(result).toEqual([mockStudents[0]]);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should fetch students with pagination', async () => {
      const pagination: PaginationParams = {
        page: 1,
        pageSize: 10,
      };

      global.fetch = jest.fn().mockImplementation((url: URL | string) => {
        expect(url.toString()).toBe('http://localhost:3000/api/students?page=1&pageSize=10');

        return Promise.resolve({
          ok: true,
          headers: {
            get: () => 'application/json',
          },
          json: () => Promise.resolve({ data: mockStudents }),
        });
      });

      const result = await api.getStudents(undefined, pagination);

      expect(result).toEqual(mockStudents);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should fetch students with sorting', async () => {
      const sort: StudentSortParams = {
        sortBy: 'firstName',
        sortOrder: 'asc',
      };

      global.fetch = jest.fn().mockImplementation((url: URL | string) => {
        expect(url.toString()).toBe('http://localhost:3000/api/students?sortBy=firstName&sortOrder=asc');

        return Promise.resolve({
          ok: true,
          headers: {
            get: () => 'application/json',
          },
          json: () => Promise.resolve({ data: mockStudents }),
        });
      });

      const result = await api.getStudents(undefined, undefined, sort);

      expect(result).toEqual(mockStudents);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should fetch students with all parameters combined', async () => {
      const filters: StudentFilters = { search: 'John', status: 'active' };
      const pagination: PaginationParams = { page: 1, pageSize: 10 };
      const sort: StudentSortParams = { sortBy: 'firstName', sortOrder: 'asc' };

      global.fetch = jest.fn().mockImplementation((url: URL | string) => {
        expect(url.toString()).toBe(
          'http://localhost:3000/api/students?search=John&status=active&page=1&pageSize=10&sortBy=firstName&sortOrder=asc',
        );

        return Promise.resolve({
          ok: true,
          headers: {
            get: () => 'application/json',
          },
          json: () => Promise.resolve({ data: [mockStudents[0]] }),
        });
      });

      const result = await api.getStudents(filters, pagination, sort);

      expect(result).toEqual([mockStudents[0]]);
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('deleteStudents', () => {
    it('should delete students with given ids', async () => {
      const studentIds = [1, 2];

      global.fetch = jest.fn().mockImplementation((url: URL | string, init?: RequestInit) => {
        expect(url.toString()).toBe('http://localhost:3000/api/students');
        expect(init).toEqual(expect.objectContaining({
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: studentIds }),
        }));

        return Promise.resolve({
          ok: true,
          headers: {
            get: () => 'application/json',
          },
          json: () => Promise.resolve({ success: true }),
        });
      });

      await api.deleteStudents(studentIds);

      expect(global.fetch).toHaveBeenCalled();
    });

    it('should handle delete error', async () => {
      const studentIds = [999];
      const errorResponse = {
        error: 'Students not found',
        status: 404,
      };

      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: false,
          status: 404,
          headers: {
            get: () => 'application/json',
          },
          json: () => Promise.resolve(errorResponse),
        });
      });

      await expect(api.deleteStudents(studentIds)).rejects.toThrow();
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
