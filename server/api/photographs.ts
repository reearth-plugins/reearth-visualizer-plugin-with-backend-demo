import { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';

import { cmsService } from '../src/services/cms';
import { CreatePhotographRequest } from '../src/types';
import { authenticate, AuthenticatedRequest } from '../src/utils/auth';
import { sendSuccess, sendError } from '../src/utils/response';
import { validateRequest, PhotographSchema } from '../src/utils/validation';

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware
function runCors(req: VercelRequest, res: VercelResponse) {
  return new Promise((resolve, reject) => {
    cors(corsOptions)(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await runCors(req, res);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check authentication
  if (!authenticate(req)) {
    return sendError(res, 'UNAUTHORIZED', 'Invalid or missing authentication token', 401);
  }

  const modelId = process.env.REEARTH_CMS_PROJECT_PHOTOGRAPHS_MODEL_ID || 'default-model-id';

  try {
    switch (req.method) {
      case 'GET':
        return await handleGetPhotographs(req, res, modelId);
      
      case 'POST':
        return await handleCreatePhotograph(req, res, modelId);
      
      default:
        return sendError(res, 'METHOD_NOT_ALLOWED', `Method ${req.method} not allowed`, 405);
    }
  } catch (error) {
    console.error('API Error:', error);
    return sendError(res, 'INTERNAL_ERROR', 'Internal server error', 500);
  }
}

async function handleGetPhotographs(_req: VercelRequest, res: VercelResponse, modelId: string) {
  try {
    const result = await cmsService.getPhotographs(modelId);
    return sendSuccess(res, result.items, 200, result.total);
  } catch (_error) {
    return sendError(res, 'FETCH_FAILED', 'Failed to fetch photographs', 500);
  }
}

async function handleCreatePhotograph(req: VercelRequest, res: VercelResponse, modelId: string) {
  const validation = validateRequest(PhotographSchema, req.body);
  
  if (!validation.success) {
    return sendError(res, 'VALIDATION_ERROR', 'Invalid request data', 400, validation.errors);
  }

  try {
    const photograph = await cmsService.createPhotograph(modelId, validation.data as CreatePhotographRequest);
    return sendSuccess(res, photograph, 201);
  } catch (_error) {
    return sendError(res, 'CREATE_FAILED', 'Failed to create photograph', 500);
  }
}