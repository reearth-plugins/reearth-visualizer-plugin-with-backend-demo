import { vi, describe, it, expect, beforeEach } from 'vitest';

import handler from '../../../api/assets/upload';
import { createMockRequest, createMockResponse } from '../../utils/test-helpers';

// Mock UUID
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid-123')
}));

// Mock authentication
vi.mock('../../../src/utils/auth', () => ({
  authenticate: vi.fn(() => true)
}));

// Mock CMS service
vi.mock('../../../src/services/cms', () => ({
  cmsService: {
    uploadAsset: vi.fn()
  }
}));

// Don't re-mock multer here since it's already mocked in setup.ts

describe('/api/assets/upload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/assets/upload', () => {
    it('should upload an image successfully', async () => {
      const { cmsService } = await import('../../../src/services/cms');
      
      // Mock CMS service response
      vi.mocked(cmsService.uploadAsset).mockResolvedValue({
        id: 'cms-asset-123',
        url: 'https://cms.example.com/assets/test-image.jpg',
        filename: 'test-image.jpg',
        size: 1024000,
        mimeType: 'image/jpeg',
        uploadedAt: '2024-01-15T10:30:00Z'
      });

      const req = createMockRequest({
        method: 'POST',
        headers: { 
          authorization: 'Bearer valid-token',
          'content-type': 'multipart/form-data'
        }
      });

      // Mock file attachment
      (req as any).file = {
        originalname: 'test-image.jpg',
        mimetype: 'image/jpeg',
        size: 1024000,
        buffer: Buffer.from('test-image-data')
      };

      const { res, status, json } = createMockResponse();

      await handler(req as any, res as any);

      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith({
        success: true,
        data: {
          id: 'cms-asset-123',
          url: 'https://cms.example.com/assets/test-image.jpg',
          filename: 'test-image.jpg',
          size: 1024000,
          mimeType: 'image/jpeg',
          uploadedAt: '2024-01-15T10:30:00Z'
        }
      });

      expect(cmsService.uploadAsset).toHaveBeenCalledWith(
        'test-project-id',
        expect.objectContaining({
          originalname: 'test-image.jpg',
          mimetype: 'image/jpeg',
          size: 1024000,
          buffer: expect.any(Buffer)
        })
      );
    });


  });

  describe('Authentication', () => {
    it('should reject requests without authentication', async () => {
      const { authenticate } = await import('../../../src/utils/auth');
      vi.mocked(authenticate).mockReturnValue(false);

      const req = createMockRequest({
        method: 'POST'
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
    it('should reject unsupported HTTP methods', async () => {
      const req = createMockRequest({
        method: 'GET',
        headers: { authorization: 'Bearer valid-token' }
      });
      const { res, status, json } = createMockResponse();

      await handler(req as any, res as any);

      expect(status).toHaveBeenCalledWith(405);
      expect(json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'METHOD_NOT_ALLOWED',
          message: 'Method GET not allowed'
        }
      });
    });
  });

});