# Cloud Pak Deployer UI - Setup Guide

## Quick Start for Engineers

This guide will help you set up and run the new Cloud Pak Deployer UI on your local machine.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For cloning the repository

### Check Your Versions

```bash
node --version   # Should be v18.x or higher
npm --version    # Should be v9.x or higher
git --version    # Any recent version
```

---

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/sametkilictas/cloud-pak-deployer.git

# Navigate to the project directory
cd cloud-pak-deployer

# Switch to the feature branch
git checkout feature/mock-ui-implementation
```

---

## Step 2: Navigate to UI Directory

```bash
cd deployer-web/ui
```

---

## Step 3: Install Dependencies

```bash
# Install all npm dependencies
npm install
```

This will install:
- React 18
- TypeScript
- Vite (build tool)
- IBM Carbon Design System
- Zustand (state management)
- React Router
- And all other dependencies

**Expected time:** 2-5 minutes depending on your internet connection

---

## Step 4: Start Development Server

```bash
# Start the development server
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

---

## Step 5: Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

### Default Login Credentials (Mock Mode)

- **Username:** `admin`
- **Password:** `admin`

> **Note:** This is mock authentication for development. Real authentication will be implemented in Phase 4.

---

## Available Scripts

### Development

```bash
# Start development server with hot reload
npm run dev

# Start development server and expose to network
npm run dev -- --host
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix
```

---

## Project Structure

```
deployer-web/ui/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Common components (cards, graphs, etc.)
│   │   ├── configuration/  # Configuration-specific components
│   │   └── layout/         # Layout components (header, sidebar)
│   ├── pages/              # Page components
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ComponentSelectionPage.tsx
│   │   ├── ConfigurationPage.tsx
│   │   └── DeploymentPage.tsx
│   ├── stores/             # Zustand state management
│   ├── services/           # Business logic and API calls
│   ├── schemas/            # Component configuration schemas
│   ├── types/              # TypeScript type definitions
│   ├── constants/          # Constants and mock data
│   └── data/               # Static data files
├── public/                 # Static assets
├── index.html             # HTML entry point
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

---

## Development Workflow

### 1. Making Changes

1. Create a new branch from `feature/mock-ui-implementation`
2. Make your changes
3. Test your changes (`npm test`)
4. Commit with descriptive messages

### 2. Testing Your Changes

```bash
# Run all tests
npm test

# Run specific test file
npm test -- ComponentSelectionPage

# Run tests in watch mode (recommended during development)
npm run test:watch
```

### 3. Code Quality

```bash
# Check for linting issues
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code (if prettier is configured)
npm run format
```

---

## Common Issues and Solutions

### Issue 1: Port 5173 Already in Use

**Error:** `Port 5173 is already in use`

**Solution:**
```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Issue 2: Module Not Found Errors

**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: TypeScript Errors

**Error:** TypeScript compilation errors

**Solution:**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Clear TypeScript cache
rm -rf node_modules/.vite
npm run dev
```

### Issue 4: Tests Failing

**Error:** Tests are failing after pulling latest changes

**Solution:**
```bash
# Clear test cache
npm test -- --clearCache

# Run tests again
npm test
```

---

## Environment Variables

Currently, the application uses mock data and doesn't require environment variables. 

For Phase 4 (API Integration), you'll need to create a `.env` file:

```bash
# Create .env file in deployer-web/ui/
touch .env
```

Example `.env` content (will be needed in Phase 4):
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080
```

---

## Browser Compatibility

The application is tested and works on:

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)

**Recommended:** Chrome or Edge for best development experience

---

## IDE Setup

### VS Code (Recommended)

Install these extensions for the best experience:

1. **ESLint** - `dbaeumer.vscode-eslint`
2. **TypeScript Vue Plugin (Volar)** - `Vue.volar`
3. **Prettier** - `esbenp.prettier-vscode`
4. **Carbon Design System Snippets** - Search for "Carbon" in extensions

### VS Code Settings

Add to your `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## Testing the Application

### Manual Testing Checklist

1. **Login Page**
   - [ ] Can log in with admin/admin
   - [ ] Error message shows for wrong credentials
   - [ ] Theme toggle works

2. **Dashboard**
   - [ ] Shows welcome message
   - [ ] Quick actions work
   - [ ] Navigation to other pages works

3. **Component Selection**
   - [ ] Can select/deselect components
   - [ ] Dependency graph displays correctly
   - [ ] Search and filter work
   - [ ] "Select All" and "Deselect All" work

4. **Configuration**
   - [ ] Global config form works
   - [ ] Component config forms display
   - [ ] YAML preview updates in real-time
   - [ ] "Test Config" button validates
   - [ ] Can download config.yaml

5. **Deployment**
   - [ ] Pre-deployment summary shows
   - [ ] Can start deployment
   - [ ] Progress bar updates
   - [ ] Logs display correctly
   - [ ] Post-deployment summary shows

---

## Getting Help

### Documentation

- **Project Docs:** `/docs/` directory
- **API Docs:** `/deployer-web/API_DOCUMENTATION.md`
- **Component Schemas:** `/deployer-web/ui/src/schemas/componentSchemas.ts`

### Resources

- **IBM Carbon Design System:** https://carbondesignsystem.com/
- **React Documentation:** https://react.dev/
- **Vite Documentation:** https://vitejs.dev/
- **Zustand Documentation:** https://zustand-demo.pmnd.rs/

### Contact

For questions or issues:
1. Check existing documentation in `/docs/`
2. Review the implementation plan: `/docs/CLOUD_PAK_UI_IMPLEMENTATION_PLAN.md`
3. Check git commit history for context
4. Create an issue in the repository

---

## Next Steps

After successfully running the UI:

1. **Explore the codebase** - Familiarize yourself with the structure
2. **Run the tests** - Understand how testing works (`npm test`)
3. **Review Phase 4 plan** - API Integration is next
4. **Check open issues** - See what needs to be done

---

## Current Status

✅ **Phase 1:** Component Selection Page - COMPLETE
✅ **Phase 2:** Configuration Page - COMPLETE (55 component schemas)
✅ **Phase 3:** Deployment Page - COMPLETE
⏳ **Phase 4:** API Integration - PENDING
⏳ **Phase 5:** Testing & Polish - PENDING

**Total Tests:** 111 passing
**Test Coverage:** Comprehensive unit and integration tests

---

## Troubleshooting

If you encounter any issues not covered here:

1. Check the terminal output for error messages
2. Check the browser console for errors (F12)
3. Try clearing cache: `rm -rf node_modules/.vite`
4. Restart the dev server
5. Check git status: `git status`
6. Ensure you're on the correct branch: `git branch`

---

**Happy Coding! 🚀**

*Last Updated: April 2026*
*Version: 1.0.0*
*Branch: feature/mock-ui-implementation*