# Street Photography Server

Node.js server for Re-Earth visualizer plugin with CMS integration, designed for deployment on Vercel.

## Features

- REST API endpoints for photograph management
- Re:Earth CMS integration
- Image upload handling
- JWT authentication
- CORS support
- TypeScript support

## API Endpoints

### Photographs

- `GET /api/photographs` - Get all photographs
- `POST /api/photographs` - Create new photograph

### Assets

- `POST /api/assets/upload` - Upload image files

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
REEARTH_CMS_INTEGRATION_API_BASE_URL=https://api.reearth.dev
REEARTH_CMS_INTEGRATION_API_ACCESS_TOKEN=your-reearth-cms-integration-token
REEARTH_CMS_PROJECT_PHOTOGRAPHS_MODEL_ID=your-cms-model-id-for-photographs
JWT_SECRET=your-jwt-secret-key
CORS_ORIGIN=http://localhost:5173
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type check
npm run type-check

# Build
npm run build
```

## Testing

The project uses **Vitest** as the testing framework for better performance and native TypeScript support.

```bash
# Run all tests
npm test

# Run tests in watch mode (interactive)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

The project includes comprehensive unit tests for:

- **API Endpoints**: `/api/photographs` and `/api/assets/upload`
- **CMS Service**: Re:Earth CMS integration functionality
- **Utility Functions**: Authentication, validation, and response helpers
- **Error Handling**: Various error scenarios and edge cases

### Testing Features

- **Vitest** for fast, native TypeScript testing
- **Coverage Reports** with v8 provider
- **Mock Support** for external dependencies (axios, multer, JWT)
- **Type-Safe Mocks** with full TypeScript integration

## Deployment

Deploy to Vercel:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Project Structure

```
server/
├── api/                 # Vercel serverless functions
│   ├── photographs.ts   # Photographs endpoint
│   └── assets/
│       └── upload.ts    # Upload endpoint
├── src/
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── docs/                # API documentation
└── package.json
```