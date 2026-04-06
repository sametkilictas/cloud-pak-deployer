/**
 * Application Routes
 * 
 * Centralized route definitions for the application.
 * Used for navigation and routing configuration.
 */

export const ROUTES = {
  // Authentication
  LOGIN: '/login',
  
  // Main pages
  DASHBOARD: '/dashboard',
  
  // Component selection
  COMPONENTS: '/components',
  COMPONENTS_SELECT: '/components/select',
  COMPONENTS_DEPENDENCIES: '/components/dependencies',
  
  // Configuration
  CONFIGURATION: '/configuration',
  CONFIGURATION_EDIT: '/configuration/edit',
  CONFIGURATION_PREVIEW: '/configuration/preview',
  CONFIGURATION_VALIDATE: '/configuration/validate',
  
  // Deployment
  DEPLOYMENT: '/deployment',
  DEPLOYMENT_START: '/deployment/start',
  DEPLOYMENT_STATUS: '/deployment/status',
  DEPLOYMENT_LOGS: '/deployment/logs',
  
  // Other
  HISTORY: '/history',
  DOCUMENTATION: '/documentation',
  
  // Default
  HOME: '/'
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];

/**
 * Route metadata for navigation and breadcrumbs
 */
export interface RouteMetadata {
  path: RoutePath;
  title: string;
  description?: string;
  requiresAuth: boolean;
  icon?: string;
}

export const ROUTE_METADATA: Record<RoutePath, RouteMetadata> = {
  [ROUTES.LOGIN]: {
    path: ROUTES.LOGIN,
    title: 'Login',
    description: 'Authenticate with OpenShift',
    requiresAuth: false
  },
  [ROUTES.HOME]: {
    path: ROUTES.HOME,
    title: 'Home',
    requiresAuth: false
  },
  [ROUTES.DASHBOARD]: {
    path: ROUTES.DASHBOARD,
    title: 'Dashboard',
    description: 'Overview of your Cloud Pak deployment',
    requiresAuth: true,
    icon: 'Dashboard'
  },
  [ROUTES.COMPONENTS]: {
    path: ROUTES.COMPONENTS,
    title: 'Components',
    description: 'Select and manage Cloud Pak components',
    requiresAuth: true,
    icon: 'Cube'
  },
  [ROUTES.COMPONENTS_SELECT]: {
    path: ROUTES.COMPONENTS_SELECT,
    title: 'Select Components',
    description: 'Choose components to deploy',
    requiresAuth: true
  },
  [ROUTES.COMPONENTS_DEPENDENCIES]: {
    path: ROUTES.COMPONENTS_DEPENDENCIES,
    title: 'View Dependencies',
    description: 'Visualize component dependencies',
    requiresAuth: true
  },
  [ROUTES.CONFIGURATION]: {
    path: ROUTES.CONFIGURATION,
    title: 'Configuration',
    description: 'Configure deployment settings',
    requiresAuth: true,
    icon: 'Settings'
  },
  [ROUTES.CONFIGURATION_EDIT]: {
    path: ROUTES.CONFIGURATION_EDIT,
    title: 'Edit Configuration',
    description: 'Modify component configurations',
    requiresAuth: true
  },
  [ROUTES.CONFIGURATION_PREVIEW]: {
    path: ROUTES.CONFIGURATION_PREVIEW,
    title: 'Preview YAML',
    description: 'Preview generated configuration',
    requiresAuth: true
  },
  [ROUTES.CONFIGURATION_VALIDATE]: {
    path: ROUTES.CONFIGURATION_VALIDATE,
    title: 'Validate Configuration',
    description: 'Validate configuration before deployment',
    requiresAuth: true
  },
  [ROUTES.DEPLOYMENT]: {
    path: ROUTES.DEPLOYMENT,
    title: 'Deployment',
    description: 'Monitor and manage deployments',
    requiresAuth: true,
    icon: 'Rocket'
  },
  [ROUTES.DEPLOYMENT_START]: {
    path: ROUTES.DEPLOYMENT_START,
    title: 'Start Deployment',
    description: 'Initiate Cloud Pak deployment',
    requiresAuth: true
  },
  [ROUTES.DEPLOYMENT_STATUS]: {
    path: ROUTES.DEPLOYMENT_STATUS,
    title: 'Deployment Status',
    description: 'View deployment progress',
    requiresAuth: true
  },
  [ROUTES.DEPLOYMENT_LOGS]: {
    path: ROUTES.DEPLOYMENT_LOGS,
    title: 'Deployment Logs',
    description: 'View deployment logs',
    requiresAuth: true
  },
  [ROUTES.HISTORY]: {
    path: ROUTES.HISTORY,
    title: 'Deployment History',
    description: 'View past deployments',
    requiresAuth: true,
    icon: 'ChartLine'
  },
  [ROUTES.DOCUMENTATION]: {
    path: ROUTES.DOCUMENTATION,
    title: 'Documentation',
    description: 'Help and documentation',
    requiresAuth: true,
    icon: 'Document'
  }
};

/**
 * Get breadcrumb trail for a given route
 */
export const getBreadcrumbs = (path: RoutePath): Array<{ label: string; path?: RoutePath }> => {
  const breadcrumbs: Array<{ label: string; path?: RoutePath }> = [
    { label: 'Home', path: ROUTES.DASHBOARD }
  ];

  const metadata = ROUTE_METADATA[path];
  if (!metadata) return breadcrumbs;

  // Add parent breadcrumbs based on path structure
  if (path.startsWith('/components')) {
    breadcrumbs.push({ label: 'Components', path: ROUTES.COMPONENTS });
    if (path !== ROUTES.COMPONENTS) {
      breadcrumbs.push({ label: metadata.title });
    }
  } else if (path.startsWith('/configuration')) {
    breadcrumbs.push({ label: 'Configuration', path: ROUTES.CONFIGURATION });
    if (path !== ROUTES.CONFIGURATION) {
      breadcrumbs.push({ label: metadata.title });
    }
  } else if (path.startsWith('/deployment')) {
    breadcrumbs.push({ label: 'Deployment', path: ROUTES.DEPLOYMENT });
    if (path !== ROUTES.DEPLOYMENT) {
      breadcrumbs.push({ label: metadata.title });
    }
  } else if (path !== ROUTES.DASHBOARD && path !== ROUTES.HOME) {
    breadcrumbs.push({ label: metadata.title });
  }

  return breadcrumbs;
};

// Made with Bob
