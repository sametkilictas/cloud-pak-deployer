/**
 * Main Application Component
 *
 * Root component that sets up routing, theme, and global providers.
 * Handles authentication flow and route protection.
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Theme } from '@carbon/react';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import { ROUTES } from './constants/routes';
import { MainLayout } from './components/layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ComponentSelectionPage } from './pages/ComponentSelectionPage';
import { ConfigurationPage } from './pages/ConfigurationPage';

// Placeholder page components - will be implemented
const DeploymentPage = () => <div className="p-4"><h1>Deployment</h1><p>Monitor deployment progress</p></div>;
const HistoryPage = () => <div className="p-4"><h1>History</h1><p>View deployment history</p></div>;
const DocumentationPage = () => <div className="p-4"><h1>Documentation</h1><p>Help and documentation</p></div>;

/**
 * Protected Route Component with Navigation
 * Redirects to login if user is not authenticated
 * Provides navigation callback to children
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  return <>{children}</>;
};

/**
 * Layout Wrapper with Navigation
 * Wraps MainLayout with navigation functionality
 */
interface LayoutWrapperProps {
  currentPath: string;
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ currentPath, children }) => {
  const navigate = useNavigate();
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  return (
    <MainLayout currentPath={currentPath} onNavigate={handleNavigate}>
      {children}
    </MainLayout>
  );
};

/**
 * Main App Component
 */
export const App: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { theme } = useThemeStore();
  // Used in conditional rendering below
  void isAuthenticated;

  // Apply theme to document element for Carbon Design System
  useEffect(() => {
    document.documentElement.setAttribute('data-carbon-theme', theme === 'dark' ? 'g100' : 'white');
  }, [theme]);

  return (
    <Theme theme={theme === 'dark' ? 'g100' : 'white'}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          
          {/* Protected routes with layout */}
          <Route
            path={ROUTES.HOME}
            element={
              <ProtectedRoute>
                <Navigate to={ROUTES.DASHBOARD} replace />
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <LayoutWrapper currentPath={ROUTES.DASHBOARD}>
                  <DashboardPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.COMPONENTS}
            element={
              <ProtectedRoute>
                <LayoutWrapper currentPath={ROUTES.COMPONENTS}>
                  <ComponentSelectionPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.COMPONENTS_SELECT}
            element={
              <ProtectedRoute>
                <LayoutWrapper currentPath={ROUTES.COMPONENTS_SELECT}>
                  <ComponentSelectionPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.COMPONENTS_DEPENDENCIES}
            element={
              <ProtectedRoute>
                <LayoutWrapper currentPath={ROUTES.COMPONENTS_DEPENDENCIES}>
                  <ComponentSelectionPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.CONFIGURATION}
            element={
              <ProtectedRoute>
                <LayoutWrapper currentPath={ROUTES.CONFIGURATION}>
                  <ConfigurationPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.CONFIGURATION_EDIT}
            element={
              <ProtectedRoute>
                <LayoutWrapper currentPath={ROUTES.CONFIGURATION_EDIT}>
                  <ConfigurationPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.CONFIGURATION_PREVIEW}
            element={
              <ProtectedRoute>
                <LayoutWrapper currentPath={ROUTES.CONFIGURATION_PREVIEW}>
                  <ConfigurationPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.CONFIGURATION_VALIDATE}
            element={
              <ProtectedRoute>
                <LayoutWrapper currentPath={ROUTES.CONFIGURATION_VALIDATE}>
                  <ConfigurationPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.DEPLOYMENT}
            element={
              <ProtectedRoute>
                <LayoutWrapper currentPath={ROUTES.DEPLOYMENT}>
                  <DeploymentPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.DEPLOYMENT_START}
            element={
              <ProtectedRoute>
                <LayoutWrapper currentPath={ROUTES.DEPLOYMENT_START}>
                  <DeploymentPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.DEPLOYMENT_STATUS}
            element={
              <ProtectedRoute>
                <LayoutWrapper currentPath={ROUTES.DEPLOYMENT_STATUS}>
                  <DeploymentPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.DEPLOYMENT_LOGS}
            element={
              <ProtectedRoute>
                <LayoutWrapper currentPath={ROUTES.DEPLOYMENT_LOGS}>
                  <DeploymentPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.HISTORY}
            element={
              <ProtectedRoute>
                <LayoutWrapper currentPath={ROUTES.HISTORY}>
                  <HistoryPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.DOCUMENTATION}
            element={
              <ProtectedRoute>
                <LayoutWrapper currentPath={ROUTES.DOCUMENTATION}>
                  <DocumentationPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          
          {/* Catch all - redirect to dashboard */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Navigate to={ROUTES.DASHBOARD} replace />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </Theme>
  );
};

export default App;

// Made with Bob
