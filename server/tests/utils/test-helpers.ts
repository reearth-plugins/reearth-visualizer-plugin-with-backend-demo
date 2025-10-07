import { VercelRequest, VercelResponse } from '@vercel/node';
import { vi } from 'vitest';

import { Photograph, CreatePhotographRequest } from '../../src/types';

// Mock request helper
export function createMockRequest(options: {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  query?: Record<string, string>;
}): Partial<VercelRequest> {
  return {
    method: options.method || 'GET',
    headers: options.headers || {},
    body: options.body,
    query: options.query || {},
  };
}

// Mock response helper that includes all necessary methods for CORS
export function createMockResponse(): {
  res: Partial<VercelResponse>;
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
  end: ReturnType<typeof vi.fn>;
  setHeader: ReturnType<typeof vi.fn>;
  getHeader: ReturnType<typeof vi.fn>;
} {
  const json = vi.fn();
  const end = vi.fn();
  const setHeader = vi.fn();
  const getHeader = vi.fn();
  const status = vi.fn(() => ({ json, end }));

  const res = {
    status,
    json,
    end,
    setHeader,
    getHeader,
    // Add other properties that CORS might need
    headersSent: false,
    statusCode: 200,
  };

  return { res, status, json, end, setHeader, getHeader };
}

// Test data fixtures
export const mockPhotograph: Photograph = {
  id: 'photo-123',
  title: 'Test Street Photo',
  photoUrl: 'https://example.com/photos/test.jpg',
  description: 'A test photograph',
  author: 'Test Photographer',
  position: {
    type: 'Point',
    coordinates: [139.6438652726942, 35.79418736999594]
  },
  createdAt: '2024-01-15T10:30:00Z'
};

export const mockCreatePhotographRequest: CreatePhotographRequest = {
  title: 'New Test Photo',
  photoUrl: 'https://example.com/photos/new-test.jpg',
  description: 'A new test photograph',
  author: 'Test Author',
  position: {
    type: 'Point',
    coordinates: [139.6438652726942, 35.79418736999594]
  }
};

export const mockCMSItem = {
  id: 'cms-item-123',
  fields: [
    { id: '1', key: 'title', value: 'Test Street Photo' },
    { id: '2', key: 'photo-url', value: 'https://example.com/photos/test.jpg' },
    { id: '3', key: 'description', value: 'A test photograph' },
    { id: '4', key: 'author', value: 'Test Photographer' },
    { id: '5', key: 'position', value: { type: 'Point', coordinates: [139.6438652726942, 35.79418736999594] } }
  ],
  createdAt: '2024-01-15T10:30:00Z'
};

export const mockCMSResponse = {
  items: [mockCMSItem],
  totalCount: 1
};