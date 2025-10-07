# Server Development Agent Instructions

## Project Overview

This is a Node.js server backend designed for the Re-Earth visualizer plugin. The server is specifically architected for deployment on Vercel's serverless platform.

## Technology Stack

- **Node.js** - Runtime environment
- **TypeScript** - For type safety and better development experience
- **Vercel** - Serverless deployment platform

## Deployment Architecture

The server follows Vercel's serverless function architecture, where each API endpoint is deployed as an individual serverless function. This ensures optimal performance, automatic scaling, and cost-effective resource usage.

## Core Functionality

The server provides REST API endpoints that will be called from the web application (plugin). It acts as a middleware layer, communicating with external CMS systems to retrieve and update data for the Re-Earth visualizer plugin.

### API Communication Flow

1. **Plugin → Server**: Web app makes API requests to server endpoints
2. **Server → CMS**: Server communicates with external CMS system
3. **CMS → Server**: CMS returns data to server
4. **Server → Plugin**: Server processes and returns data to web app

## CMS Integration

The server will communicate with **Re:Earth CMS** as the external content management system. All CMS integration details and API specifications should follow the documentation at `docs/reearth-cms-integration-api-document.md`.

### CMS Communication

- Use Re:Earth CMS API endpoints for data retrieval and updates
- Handle authentication and authorization for CMS access
- Process and transform CMS data for plugin consumption

### CMS Authentication

The server requires an access token to communicate with Re:Earth CMS Integration API. This token should be configured as a Vercel environment variable:

- **Environment Variable**: `REEARTH_CMS_INTEGRATION_API_ACCESS_TOKEN`
- **Storage**: Vercel Project Settings → Environment Variables
- **Usage**: Include in Authorization header as `Bearer <token>` for all CMS API requests

## Code Quality Standards

### Markdown Linting Rules

All documentation files should follow markdownlint standards:

- **MD022**: Headings must be surrounded by blank lines above and below
- **MD031**: Fenced code blocks must have blank lines before and after
- **MD032**: Lists must have blank lines before and after
- **MD040**: Fenced code blocks must specify a language (e.g., `json`, `javascript`)
- **MD047**: Files must end with exactly one newline character

These rules ensure consistent, readable documentation formatting across the project.
