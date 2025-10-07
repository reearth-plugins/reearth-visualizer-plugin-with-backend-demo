import { vi, describe, it, expect, beforeEach } from 'vitest';

import handler from '../../api/photographs';
import { cmsService } from '../../src/services/cms';
import { createMockRequest, createMockResponse, mockPhotograph, mockCreatePhotographRequest } from '../utils/test-helpers';

// Mock the CMS service
vi.mock('../../src/services/cms', () => ({
  cmsService: {
    getPhotographs: vi.fn(),
    createPhotograph: vi.fn()
  }
}));

// Mock authentication
vi.mock('../../src/utils/auth', () => ({
  authenticate: vi.fn(() => true),
  AuthenticatedRequest: vi.fn()
}));

const mockedCmsService = cmsService as any;

describe('/api/photographs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/photographs', () => {
    it('should return photographs successfully', async () => {
      const mockResult = {
        items: [mockPhotograph],
        total: 1
      };
      
      mockedCmsService.getPhotographs.mockResolvedValue(mockResult);

      const req = createMockRequest({
        method: 'GET',
        headers: { authorization: 'Bearer valid-token' }
      });
      const { res, status, json } = createMockResponse();

      await handler(req as any, res as any);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({
        success: true,
        data: [mockPhotograph],
        total: 1
      });
    });

    it('should handle CMS service errors', async () => {
      mockedCmsService.getPhotographs.mockRejectedValue(new Error('CMS Error'));

      const req = createMockRequest({
        method: 'GET',
        headers: { authorization: 'Bearer valid-token' }
      });
      const { res, status, json } = createMockResponse();

      await handler(req as any, res as any);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch photographs'
        }
      });
    });
  });

  describe('POST /api/photographs', () => {
    it('should create a photograph successfully', async () => {
      mockedCmsService.createPhotograph.mockResolvedValue(mockPhotograph);

      const req = createMockRequest({
        method: 'POST',
        headers: { authorization: 'Bearer valid-token' },
        body: mockCreatePhotographRequest
      });
      const { res, status, json } = createMockResponse();

      await handler(req as any, res as any);

      expect(mockedCmsService.createPhotograph).toHaveBeenCalledWith(
        'test-model-id',
        mockCreatePhotographRequest
      );
      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith({
        success: true,
        data: mockPhotograph
      });
    });

    it('should validate request body', async () => {
      const invalidRequest = {
        title: '', // Invalid: empty title
        photoUrl: 'invalid-url', // Invalid: not a URL
        author: '', // Invalid: empty author
        position: {
          type: 'Point',
          coordinates: [200, 100] // Invalid: longitude out of range
        }
      };

      const req = createMockRequest({
        method: 'POST',
        headers: { authorization: 'Bearer valid-token' },
        body: invalidRequest
      });
      const { res, status, json } = createMockResponse();

      await handler(req as any, res as any);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: expect.any(Array)
        }
      });
    });

    it('should handle CMS creation errors', async () => {
      mockedCmsService.createPhotograph.mockRejectedValue(new Error('CMS Creation Error'));

      const req = createMockRequest({
        method: 'POST',
        headers: { authorization: 'Bearer valid-token' },
        body: mockCreatePhotographRequest
      });
      const { res, status, json } = createMockResponse();

      await handler(req as any, res as any);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'CREATE_FAILED',
          message: 'Failed to create photograph'
        }
      });
    });
  });

  describe('Authentication', () => {
    it('should reject requests without authentication', async () => {
      // Mock authentication to return false
      const { authenticate } = await import('../../src/utils/auth');
      vi.mocked(authenticate).mockReturnValue(false);

      const req = createMockRequest({
        method: 'GET'
      });
      const { res, status, json } = createMockResponse();

      await handler(req as any, res as any);

      expect(status).toHaveBeenCalledWith(401);
      expect(json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or missing authentication token'
        }
      });
    });
  });

  describe('Unsupported methods', () => {
    it('should reject unsupported HTTP methods with valid auth', async () => {
      // Ensure authentication returns true for this test
      const { authenticate } = await import('../../src/utils/auth');
      vi.mocked(authenticate).mockReturnValue(true);

      const req = createMockRequest({
        method: 'DELETE',
        headers: { authorization: 'Bearer valid-token' }
      });
      const { res, status, json } = createMockResponse();

      await handler(req as any, res as any);

      expect(status).toHaveBeenCalledWith(405);
      expect(json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'METHOD_NOT_ALLOWED',
          message: 'Method DELETE not allowed'
        }
      });
    });
  });
});