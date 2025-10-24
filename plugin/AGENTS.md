# Re:Earth Visualizer Plugin (Frontend)

This is the frontend component of the Re:Earth Visualizer street photography plugin, built with React, TypeScript, and ShadCN/UI components.

## Project Overview

A Re:Earth Visualizer plugin that provides interactive street photography visualization with two main extensions:

- **`sp_submitter`** - Street Photography Submitter for data entry
- **`sp_viewer`** - Street Photography Viewer for data visualization

## Tech Stack

- **React 19.1.0** with **TypeScript 5.7.2**
- **Vite 6.0.3** for build tooling and development
- **TailwindCSS 4.1.10** with ShadCN/UI components
- **Radix UI** primitives for accessible components
- **Re:Earth Core** 0.0.7-alpha.38 for plugin API
- **Security features** - Honeypot protection for bot prevention

## Architecture

### Plugin Structure

This follows Re:Earth's extension-based architecture:

```
src/extensions/
├── sp_submitter/           # Data submission extension
│   ├── sp_submitter.ts     # Main extension logic
│   └── submitter/          # React UI component
├── sp_viewer/              # Data viewing extension
│   ├── sp_viewer.ts        # Main extension logic
│   ├── viewer/             # Main viewer UI
│   └── infomodal/          # Modal UI component
└── shared/                 # Shared utilities and components
```

### Communication Layer

- **Extension Scripts** handle Re:Earth API interactions
- **UI Components** provide React-based interfaces
- **PostMessage API** enables bidirectional communication between layers

## Development Commands

### Interactive Extension Management

```bash
yarn manage                 # Interactive tool for creating/managing extensions
```

### Development Servers

```bash
yarn dev:sp_submitter:submitter    # Dev server for submitter UI
yarn dev:sp_viewer:viewer          # Dev server for viewer UI
yarn dev:sp_viewer:infomodal       # Dev server for info modal UI
yarn dev-build                     # Concurrent dev build with preview
```

### Building

```bash
yarn build                  # Build all extensions and create zip package
yarn build:sp_submitter     # Build submitter extension only
yarn build:sp_viewer        # Build viewer extension only
yarn preview               # Preview built plugin on port 5005
```

### Code Quality

```bash
yarn lint                  # Run ESLint
yarn fix                   # Fix ESLint issues
yarn format               # Format with Prettier
yarn type                 # TypeScript type checking
```

## Security Features

### Honeypot Protection

The submitter form includes client-side honeypot protection:

- **Hidden field** - `website` input field hidden via CSS (`.hp` class)
- **Bot detection** - Client-side validation rejects submissions with filled honeypot
- **Silent rejection** - Prevents form submission without alerting bots
- **Accessibility** - Properly configured with `tabIndex={-1}` and `aria-hidden`

Works with server-side honeypot validation for comprehensive bot protection.

## Backend Integration

This plugin integrates with the companion server (../server) for:

- **Data persistence** via REST API endpoints
- **Image uploads** for street photography assets
- **CMS integration** through the backend service

API client configuration in `src/shared/api/client.ts`.

## Plugin Configuration

Main plugin definition in `public/reearth.yml` defines:

- Plugin metadata and versioning
- Extension configurations and schemas
- UI component locations and types

## Development Workflow

1. **Setup**: Install dependencies with `yarn install`
2. **Develop**: Use `yarn dev-build` for hot reload development
3. **Test**: Preview with Re:Earth Visualizer via development mode
4. **Build**: Create production plugin with `yarn build`
5. **Deploy**: Upload generated zip from `package/` directory

## Node Requirements

- Node.js >= 20.11.0
- Yarn 4.5.1 (managed via packageManager)
