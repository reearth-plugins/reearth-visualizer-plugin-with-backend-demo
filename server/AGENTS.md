# Re:Earth Visualizer Plugin Server (Backend)

This is the backend API server for the Re:Earth Visualizer street photography plugin, built with Node.js and TypeScript, designed for Vercel serverless deployment.

## Project Overview

A Node.js backend that provides REST API endpoints for the street photography plugin, integrating with Re:Earth CMS for data persistence and managing image uploads.

## Tech Stack

- **Node.js 22.x** with **TypeScript 5.9.3**
- **Vercel** serverless functions for deployment
- **Axios** for HTTP requests to external APIs
- **Multer** for file upload handling
- **Zod** for runtime type validation
- **Vitest** for testing framework

## Architecture

### Serverless Functions

```
api/
├── photographs.ts          # GET/POST photographs endpoint
└── assets/
    └── upload.ts          # POST image upload endpoint
```

### Core Services

```
src/
├── services/
│   └── cms.ts             # Re:Earth CMS integration service
├── utils/
│   ├── auth.ts            # JWT authentication utilities
│   ├── validation.ts      # Request validation with Zod
│   └── response.ts        # Standardized API responses
└── types/
    └── index.ts           # TypeScript type definitions
```

## API Endpoints

### Photographs Management

- **`GET /api/photographs`** - Retrieve all street photographs
- **`POST /api/photographs`** - Create new photograph entry

### Asset Management

- **`POST /api/assets/upload`** - Upload image files with validation

## Development Commands

```bash
yarn dev:local             # Start development server on port 5200
yarn build                 # Build TypeScript to dist/
yarn type-check           # TypeScript type checking
yarn lint                 # Run ESLint
yarn lint:fix             # Fix ESLint issues
```

## Testing

```bash
yarn test                  # Run all tests
yarn test:watch           # Run tests in watch mode
yarn test:coverage        # Run tests with coverage report
```

### Test Coverage

- API endpoints with mock data
- CMS service integration
- Utility functions (auth, validation, response)
- Error handling scenarios

## Environment Configuration

Required environment variables for deployment:

```bash
REEARTH_CMS_INTEGRATION_API_BASE_URL=https://api.reearth.dev
REEARTH_CMS_INTEGRATION_API_ACCESS_TOKEN=your-cms-token
REEARTH_CMS_PROJECT_PHOTOGRAPHS_MODEL_ID=your-model-id
API_SECRET_KEY=your_secret_key
CORS_ORIGIN=null
```

Note: API_SECRET_KEY is static, please generate a secure random string for production. it will be required for authenticating requests from the plugin.

## CMS Integration

The server integrates with **Re:Earth CMS Integration API** for:

- **Data persistence** for photograph metadata
- **Asset management** for uploaded images
- **Authentication** via API tokens

API documentation available in `docs/reearth-cms-integration-api-document.md`.

## Deployment

Designed for **Vercel** serverless deployment:

1. Connect repository to Vercel
2. Configure environment variables in dashboard
3. Auto-deploy on push to main branch

## CORS Configuration

Supports configurable CORS origins for plugin integration:

- Production: Configure via `CORS_ORIGIN` environment variable
- Note: for plugin call, please set `null` to allow all origins.
