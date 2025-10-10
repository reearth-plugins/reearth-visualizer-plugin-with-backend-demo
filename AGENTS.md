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
- TypeScript throughout the stack
- Modern tooling (Vite, Vercel, ShadCN/UI)

## Development Workflow

Each component can be developed independently:

```bash
# Plugin development
cd plugin && yarn dev-build

# Server development
# Nested path issue: https://github.com/vercel/vercel/issues/13639
# If you didn't link on root, remove --cwd ..
cd server && yarn dev:local
```

## Getting Started

1. Set up the backend server first (see `/server/README.md`)
2. Configure the plugin with backend endpoints (see `/plugin/README.md`)
3. Deploy and test the integration

For detailed instructions, see the README files in each subdirectory.
