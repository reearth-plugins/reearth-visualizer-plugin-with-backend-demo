import { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';
import multer from 'multer';

import { cmsService } from '../../src/services/cms';
import { authenticate, AuthenticatedRequest } from '../../src/utils/auth';
import { sendSuccess, sendError } from '../../src/utils/response';

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['POST', 'OPTIONS'],
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


// Multer configuration for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Check if file is an image
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Wrapper to promisify multer
function runMulter(req: VercelRequest, res: VercelResponse) {
  return new Promise((resolve, reject) => {
    upload.single('image')(req as any, res as any, (error: unknown) => {
      if (error) {
        return reject(error);
      }
      resolve(req);
    });
  });
}


export default async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await runCors(req, res);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return sendError(res, 'METHOD_NOT_ALLOWED', `Method ${req.method} not allowed`, 405);
  }

  // Check authentication
  if (!authenticate(req)) {
    return sendError(res, 'UNAUTHORIZED', 'Invalid or missing authentication token', 401);
  }

  const projectId = process.env.REEARTH_CMS_PROJECT_ID || 'default-project-id';

  try {
    // Process file upload
    await runMulter(req, res);
    
    const file = (req as any).file;
    
    if (!file) {
      return sendError(res, 'NO_FILE', 'No image file provided', 400);
    }

    // Upload to CMS
    const uploadedAsset = await cmsService.uploadAsset(projectId, file);

    return sendSuccess(res, uploadedAsset, 201);

  } catch (error: unknown) {
    console.error('Upload error:', error);
    
    if (error instanceof Error && error.message === 'Only image files are allowed') {
      return sendError(res, 'INVALID_FILE_TYPE', 'Only image files are allowed', 400);
    }
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 'FILE_TOO_LARGE', 'File size exceeds 10MB limit', 413);
    }
    
    return sendError(res, 'UPLOAD_FAILED', 'File upload failed', 500);
  }
}

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};