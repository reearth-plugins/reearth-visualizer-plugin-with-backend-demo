import axios from 'axios';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { cmsService } from '../../src/services/cms';
import { mockCMSItem, mockCMSResponse, mockCreatePhotographRequest } from '../utils/test-helpers';

const mockedAxios = vi.mocked(axios);

describe('CMS Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPhotographs', () => {
    it('should fetch photographs from CMS successfully', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockCMSResponse });

      const result = await cmsService.getPhotographs('test-model-id');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://test-api.reearth.dev/models/test-model-id/items',
        {
          headers: {
            Authorization: 'Bearer test-token',
            'Content-Type': 'application/json'
          }
        }
      );

      expect(result).toEqual({
        items: [{
          id: 'cms-item-123',
          title: 'Test Street Photo',
          photoUrl: 'https://example.com/photos/test.jpg',
          description: 'A test photograph',
          author: 'Test Photographer',
          position: {
            type: 'Point',
            coordinates: [139.6438652726942, 35.79418736999594]
          },
          createdAt: '2024-01-15T10:30:00Z'
        }],
        total: 1
      });
    });

    it('should handle missing fields gracefully', async () => {
      const incompleteItem = {
        id: 'incomplete-item',
        fields: [
          { id: '1', key: 'title', value: 'Incomplete Photo' }
        ],
        createdAt: '2024-01-15T10:30:00Z'
      };

      mockedAxios.get.mockResolvedValue({
        data: { items: [incompleteItem], totalCount: 1 }
      });

      const result = await cmsService.getPhotographs('test-model-id');

      expect(result.items[0]).toEqual({
        id: 'incomplete-item',
        title: 'Incomplete Photo',
        photoUrl: '',
        description: undefined,
        author: '',
        position: undefined,
        createdAt: '2024-01-15T10:30:00Z'
      });
    });

    it('should handle CMS API errors', async () => {
      const error = new Error('CMS API Error');
      mockedAxios.get.mockRejectedValue(error);

      await expect(cmsService.getPhotographs('test-model-id')).rejects.toThrow('Failed to fetch photographs');
    });

    it('should handle network errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network Error'));

      await expect(cmsService.getPhotographs('test-model-id')).rejects.toThrow('Failed to fetch photographs');
    });
  });

  describe('createPhotograph', () => {
    it('should create a photograph in CMS successfully', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockCMSItem });

      const result = await cmsService.createPhotograph('test-model-id', mockCreatePhotographRequest);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://test-api.reearth.dev/models/test-model-id/items',
        {
          fields: [
            { key: 'title', value: 'New Test Photo' },
            { key: 'photo-url', value: 'https://example.com/photos/new-test.jpg' },
            { key: 'description', value: 'A new test photograph' },
            { key: 'author', value: 'Test Author' },
            { key: 'position', value: { type: 'Point', coordinates: [139.6438652726942, 35.79418736999594] } }
          ]
        },
        {
          headers: {
            Authorization: 'Bearer test-token',
            'Content-Type': 'application/json'
          }
        }
      );

      expect(result).toEqual({
        id: 'cms-item-123',
        title: 'Test Street Photo',
        photoUrl: 'https://example.com/photos/test.jpg',
        description: 'A test photograph',
        author: 'Test Photographer',
        position: {
          type: 'Point',
          coordinates: [139.6438652726942, 35.79418736999594]
        },
        createdAt: '2024-01-15T10:30:00Z'
      });
    });

    it('should handle empty description correctly', async () => {
      const requestWithoutDescription = {
        ...mockCreatePhotographRequest,
        description: undefined
      };

      mockedAxios.post.mockResolvedValue({ data: mockCMSItem });

      await cmsService.createPhotograph('test-model-id', requestWithoutDescription);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          fields: expect.arrayContaining([
            { key: 'description', value: '' }
          ])
        }),
        expect.any(Object)
      );
    });

    it('should handle CMS creation errors', async () => {
      const error = new Error('CMS Creation Error');
      mockedAxios.post.mockRejectedValue(error);

      await expect(
        cmsService.createPhotograph('test-model-id', mockCreatePhotographRequest)
      ).rejects.toThrow('Failed to create photograph');
    });

    it('should handle validation errors from CMS', async () => {
      const validationError = {
        response: {
          status: 400,
          data: { message: 'Validation failed' }
        }
      };
      mockedAxios.post.mockRejectedValue(validationError);

      await expect(
        cmsService.createPhotograph('test-model-id', mockCreatePhotographRequest)
      ).rejects.toThrow('Failed to create photograph');
    });
  });

  describe('Field transformation', () => {
    it('should transform CMS fields to photograph object correctly', async () => {
      const cmsItemWithAllFields = {
        id: 'full-item',
        fields: [
          { id: '1', key: 'title', value: 'Complete Photo' },
          { id: '2', key: 'photo-url', value: 'https://example.com/complete.jpg' },
          { id: '3', key: 'description', value: 'A complete photograph' },
          { id: '4', key: 'author', value: 'Complete Author' },
          { id: '5', key: 'position', value: { type: 'Point', coordinates: [100, 50] } }
        ],
        createdAt: '2024-01-15T10:30:00Z'
      };

      mockedAxios.get.mockResolvedValue({
        data: { items: [cmsItemWithAllFields], totalCount: 1 }
      });

      const result = await cmsService.getPhotographs('test-model-id');

      expect(result.items[0]).toEqual({
        id: 'full-item',
        title: 'Complete Photo',
        photoUrl: 'https://example.com/complete.jpg',
        description: 'A complete photograph',
        author: 'Complete Author',
        position: { type: 'Point', coordinates: [100, 50] },
        createdAt: '2024-01-15T10:30:00Z'
      });
    });

    it('should transform photograph to CMS fields correctly', async () => {
      const photographRequest = {
        title: 'Transform Test',
        photoUrl: 'https://example.com/transform.jpg',
        description: 'Transform description',
        author: 'Transform Author',
        position: { type: 'Point' as const, coordinates: [120, 30] as [number, number] }
      };

      mockedAxios.post.mockResolvedValue({ data: mockCMSItem });

      await cmsService.createPhotograph('test-model-id', photographRequest);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        {
          fields: [
            { key: 'title', value: 'Transform Test' },
            { key: 'photo-url', value: 'https://example.com/transform.jpg' },
            { key: 'description', value: 'Transform description' },
            { key: 'author', value: 'Transform Author' },
            { key: 'position', value: { type: 'Point', coordinates: [120, 30] } }
          ]
        },
        expect.any(Object)
      );
    });
  });

  describe('Headers configuration', () => {
    it('should include correct authorization headers', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockCMSResponse });

      await cmsService.getPhotographs('test-model-id');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        {
          headers: {
            Authorization: 'Bearer test-token',
            'Content-Type': 'application/json'
          }
        }
      );
    });
  });
});