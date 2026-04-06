# Cloud Pak Deployer UI

Professional web interface for deploying IBM Cloud Pak software on OpenShift clusters, built with IBM Carbon Design System.

## Overview

This is a modern React-based UI that provides an intuitive interface for:
- Selecting Cloud Pak components with intelligent dependency resolution
- Configuring deployment parameters
- Monitoring deployment progress in real-time
- Managing deployment history

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **IBM Carbon Design System v11** - Professional IBM UI components
- **Zustand** - Lightweight state management
- **React Hook Form** - Form management
- **React Router** - Client-side routing
- **react-force-graph** - Dependency visualization

## Project Structure

```
deployer-web/ui/
├── docs/                           # Documentation
│   ├── CLOUD_PAK_UI_IMPLEMENTATION_PLAN.md
│   ├── CLOUD_PAK_UI_DETAILED_SPECS.md
│   ├── CLOUD_PAK_UI_IMPLEMENTATION_GUIDE.md
│   └── MOCK_UI_IMPLEMENTATION_STATUS.md
├── src/
│   ├── components/                 # React components
│   │   ├── common/                 # Reusable components
│   │   │   ├── ComponentCard.tsx
│   │   │   ├── DependencyGraph.tsx
│   │   │   ├── DynamicForm.tsx
│   │   │   ├── LogViewer.tsx
│   │   │   └── ProgressIndicator.tsx
│   │   └── layout/                 # Layout components
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── MainLayout.tsx
│   ├── constants/                  # Constants and mock data
│   │   ├── mockComponents.ts
│   │   ├── mockLogs.ts
│   │   └── routes.ts
│   ├── services/                   # Business logic
│   │   └── dependency/
│   │       └── DependencyResolver.ts
│   ├── stores/                     # State management (Zustand)
│   │   ├── authStore.ts
│   │   ├── componentStore.ts
│   │   ├── configStore.ts
│   │   └── deploymentStore.ts
│   ├── types/                      # TypeScript types
│   │   ├── component.types.ts
│   │   ├── config.types.ts
│   │   └── api.types.ts
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
├── index.html                      # HTML template
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
└── vite.config.ts                  # Vite config
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Access to an OpenShift cluster (for production use)

### Installation

```bash
# Navigate to the UI directory
cd deployer-web/ui

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## Features

### Intelligent Component Selection
- Browse Cloud Pak components catalog
- Auto-resolve dependencies when selecting components
- Visual dependency graph showing relationships
- Conflict detection and prevention
- Clear explanations for auto-selected components

### Dynamic Configuration
- Schema-driven form generation
- Real-time validation
- YAML preview
- Configuration import/export
- Save and load configurations

### Deployment Monitoring
- Real-time progress tracking
- Stage-based progress indicators
- Log streaming with filtering
- Pause/resume/cancel capabilities
- Post-deployment summary

### Professional UI/UX
- IBM Carbon Design System compliance
- Responsive design (desktop/tablet)
- Dark theme support
- Accessibility features
- Intuitive navigation

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

### Code Structure

The codebase follows a modular architecture:

1. **Components** - Reusable UI components
2. **Stores** - Zustand stores for state management
3. **Services** - Business logic and utilities
4. **Types** - TypeScript type definitions
5. **Constants** - Configuration and mock data

### Adding New Components

1. Create component file in `src/components/`
2. Add corresponding CSS file
3. Export from `index.ts`
4. Use in pages or other components

### State Management

The application uses Zustand for state management:

- `authStore` - Authentication state
- `componentStore` - Component selection and dependencies
- `configStore` - Configuration management
- `deploymentStore` - Deployment status and logs

## Known Issues

### TypeScript Errors

Some TypeScript errors exist due to:
- Missing `react-force-graph-2d` types (install `@types/react-force-graph-2d` if available)
- Path alias resolution (configured in tsconfig.json)
- Some unused variables (can be cleaned up)

These don't prevent the application from running in development mode.

### Dependencies

The project uses `--legacy-peer-deps` flag due to peer dependency conflicts between:
- `@typescript-eslint/eslint-plugin` versions
- React 18 and some Carbon components

This is a known issue and doesn't affect functionality.

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

## Deployment

### Docker

```bash
# Build Docker image
docker build -t cloud-pak-deployer-ui .

# Run container
docker run -p 3000:3000 cloud-pak-deployer-ui
```

### OpenShift

```bash
# Deploy to OpenShift
oc new-app . --name=cloud-pak-deployer-ui
oc expose svc/cloud-pak-deployer-ui
```

## Configuration

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_WS_URL=ws://localhost:8080/ws
```

### Backend Integration

The UI is designed to work with the Cloud Pak Deployer backend API. Configure the API URL in `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **Implementation Plan** - High-level architecture and approach
- **Detailed Specs** - Technical specifications and wireframes
- **Implementation Guide** - Step-by-step implementation details
- **Status** - Current implementation progress

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

Copyright IBM Corporation

## Support

For issues and questions:
- Check the documentation in `docs/`
- Review the implementation guides
- Contact the development team

## Roadmap

### Completed
- ✅ Core infrastructure and state management
- ✅ UI components (ComponentCard, DependencyGraph, DynamicForm, LogViewer, ProgressIndicator)
- ✅ Layout components (Header, Sidebar, MainLayout)
- ✅ Application routing and entry points
- ✅ Mock data and constants

### In Progress
- 🚧 Page components (Authentication, Component Selection, Configuration, Deployment)
- 🚧 API client implementation
- 🚧 WebSocket integration for log streaming

### Planned
- ⏳ Complete page implementations
- ⏳ Integration tests
- ⏳ E2E tests
- ⏳ Performance optimization
- ⏳ Accessibility audit

## Acknowledgments

Built with:
- IBM Carbon Design System
- React and TypeScript
- Vite build tool
- Zustand state management

---

**Version**: 1.0.0  
**Last Updated**: 2026-04-06  
**Status**: Active Development