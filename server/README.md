# Street Photography Server

Node.js server for Re-Earth visualizer plugin with CMS integration, designed for deployment on Vercel.

## Features

- REST API endpoints for photograph management
- Re:Earth CMS integration
- Image upload handling
- JWT authentication
- CORS support
- **Rate limiting** - IP-based request throttling
- **Honeypot protection** - Bot detection and silent blocking
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

## Security Features

### Rate Limiting

The server implements IP-based rate limiting to prevent abuse:

- **General API**: 30 requests per minute per IP
- **Photograph Creation**: 30 requests per 15 minutes per IP
- Returns appropriate HTTP 429 status and `Retry-After` headers
- Automatic cleanup of expired rate limit entries

Rate limit headers included in responses:
- `X-RateLimit-Limit` - Maximum requests allowed
- `X-RateLimit-Remaining` - Requests remaining in current window  
- `X-RateLimit-Reset` - Time when rate limit resets

### Honeypot Protection

Protection against automated bot submissions:

- Hidden `website` field in photograph submission forms
- Legitimate users won't fill this field (hidden via CSS)
- Bots often fill all available form fields
- Submissions with filled `website` field are silently rejected
- Returns successful response to avoid tipping off bots

## Project Structure

```
server/
├── api/                 # Vercel serverless functions
│   ├── photographs.ts   # Photographs endpoint with rate limiting & honeypot
│   └── assets/
│       └── upload.ts    # Upload endpoint
├── src/
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
│       ├── rateLimiter.ts  # Rate limiting implementation
│       ├── validation.ts   # Request validation with honeypot
│       └── ...
├── docs/                # API documentation
└── package.json
```