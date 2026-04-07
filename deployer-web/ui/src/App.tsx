/**
 * Main Application Component
 * 
 * Root component that sets up routing, theme, and global providers.
 * Handles authentication flow and route protection.
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Theme } from '@carbon/react';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import { ROUTES } from './constants/routes';
import { MainLayout } from './components/layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ComponentSelectionPage } from './pages/ComponentSelectionPage';

// Placeholder page components - will be implemented
const ConfigurationPage = () => <div className="p-4"><h1>Configuration</h1><p>Configure your deployment</p></div>;
const DeploymentPage = () => <div className="p-4"><h1>Deployment</h1><p>Monitor deployment progress</p></div>;
const HistoryPage = () => <div className="p-4"><h1>History</h1><p>View deployment history</p></div>;
const DocumentationPage = () => <div className="p-4"><h1>Documentation</h1><p>Help and documentation</p></div>;

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
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
                <MainLayout currentPath={ROUTES.DASHBOARD}>
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.COMPONENTS}
            element={
              <ProtectedRoute>
                <MainLayout currentPath={ROUTES.COMPONENTS}>
                  <ComponentSelectionPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.COMPONENTS_SELECT}
            element={
              <ProtectedRoute>
                <MainLayout currentPath={ROUTES.COMPONENTS_SELECT}>
                  <ComponentSelectionPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.COMPONENTS_DEPENDENCIES}
            element={
              <ProtectedRoute>
                <MainLayout currentPath={ROUTES.COMPONENTS_DEPENDENCIES}>
                  <ComponentSelectionPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.CONFIGURATION}
            element={
              <ProtectedRoute>
                <MainLayout currentPath={ROUTES.CONFIGURATION}>
                  <ConfigurationPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.CONFIGURATION_EDIT}
            element={
              <ProtectedRoute>
                <MainLayout currentPath={ROUTES.CONFIGURATION_EDIT}>
                  <ConfigurationPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.CONFIGURATION_PREVIEW}
            element={
              <ProtectedRoute>
                <MainLayout currentPath={ROUTES.CONFIGURATION_PREVIEW}>
                  <ConfigurationPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.CONFIGURATION_VALIDATE}
            element={
              <ProtectedRoute>
                <MainLayout currentPath={ROUTES.CONFIGURATION_VALIDATE}>
                  <ConfigurationPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.DEPLOYMENT}
            element={
              <ProtectedRoute>
                <MainLayout currentPath={ROUTES.DEPLOYMENT}>
                  <DeploymentPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.DEPLOYMENT_START}
            element={
              <ProtectedRoute>
                <MainLayout currentPath={ROUTES.DEPLOYMENT_START}>
                  <DeploymentPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.DEPLOYMENT_STATUS}
            element={
              <ProtectedRoute>
                <MainLayout currentPath={ROUTES.DEPLOYMENT_STATUS}>
                  <DeploymentPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.DEPLOYMENT_LOGS}
            element={
              <ProtectedRoute>
                <MainLayout currentPath={ROUTES.DEPLOYMENT_LOGS}>
                  <DeploymentPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.HISTORY}
            element={
              <ProtectedRoute>
                <MainLayout currentPath={ROUTES.HISTORY}>
                  <HistoryPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.DOCUMENTATION}
            element={
              <ProtectedRoute>
                <MainLayout currentPath={ROUTES.DOCUMENTATION}>
                  <DocumentationPage />
                </MainLayout>
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
