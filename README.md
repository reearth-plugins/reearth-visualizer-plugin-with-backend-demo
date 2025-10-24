# Re:Earth Visualizer Plugin with Backend Demo

This is a full-stack demo project showcasing a Re:Earth Visualizer plugin with a backend server integration. The project demonstrates street photography visualization with CMS integration.

## Project Structure

This repository contains three main components:

- **`/plugin`** - Re:Earth Visualizer plugin frontend (React + TypeScript)
- **`/server`** - Backend API server (Node.js + TypeScript, Vercel deployment)
- **Root** - Main project configuration and coordination

## Architecture Overview

The project demonstrates a complete workflow:

1. **Plugin Frontend** creates interactive visualizations in Re:Earth
2. **Backend Server** manages data persistence and CMS integration
3. **Integration** between plugin and server via REST API

## Key Features

- Street photography visualization plugin for Re:Earth Visualizer
- CMS integration for data management
- Image upload and processing capabilities
- **Security features** - Rate limiting and honeypot protection
- TypeScript throughout the stack
- Modern tooling (Vite, Vercel, ShadCN/UI)

## Quick Start

### Prerequisites

- Node.js >= 20.11.0
- Yarn package manager

### 1. Setup Backend Server

```bash
cd server
yarn install
cp .env.example .env
# Configure environment variables in .env
yarn dev:local
```

### 2. Setup Plugin Frontend

```bash
cd plugin
yarn install
yarn dev-build
```

### 3. Integration with Re:Earth Visualizer

1. Run Re:Earth Visualizer locally
2. Set environment variable: `REEARTH_WEB_DEV_PLUGIN_URLS='["http://localhost:5005"]'`
3. Use development buttons in Re:Earth editor to install and reload the plugin

## Development Workflow

Each component can be developed independently:

```bash
# Plugin development
cd plugin && yarn dev-build

# Server development
cd server && yarn dev:local
```

## Tech Stack

### Frontend Plugin

- React 19.1.0 + TypeScript 5.7.2
- Vite 6.0.3 for build tooling
- TailwindCSS 4.1.10 + ShadCN/UI
- Re:Earth Core API integration

### Backend Server

- Node.js 22.x + TypeScript 5.9.3
- Vercel serverless functions
- Re:Earth CMS integration
- Rate limiting and honeypot security features
- Comprehensive test coverage with Vitest

## API Endpoints

- `GET /api/photographs` - Retrieve street photographs
- `POST /api/photographs` - Create new photograph entry
- `POST /api/assets/upload` - Upload image files

## Testing

```bash
# Server tests
cd server && yarn test

# Plugin linting and type checking
cd plugin && yarn lint && yarn type
```

## Deployment

### Backend (Vercel)

1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Plugin

1. Build with `cd plugin && yarn build`
2. Upload generated zip file from `plugin/package/`
3. Install in Re:Earth Visualizer

## Documentation

For detailed instructions, see the README files in each subdirectory:

- [Plugin README](./plugin/README.md) - Frontend development guide
- [Server README](./server/README.md) - Backend API documentation

## License

This project is licensed under the MIT License - see individual component licenses for details.
