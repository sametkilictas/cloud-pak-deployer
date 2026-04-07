/**
 * Sidebar Component
 * 
 * Side navigation panel for the application.
 * Uses IBM Carbon Design System SideNav pattern.
 * 
 * Features:
 * - Collapsible navigation
 * - Active route highlighting
 * - Icon-based navigation items
 * - Responsive behavior
 */

import React from 'react';
import {
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem
} from '@carbon/react';
import {
  Dashboard,
  Cube,
  Settings,
  Rocket,
  Document,
  ChartLine
} from '@carbon/icons-react';
import './Sidebar.css';

interface SidebarProps {
  isOpen?: boolean;
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  currentPath = '/',
  onNavigate
}) => {
  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const isActive = (path: string) => currentPath === path;

  return (
    <SideNav
      aria-label="Side navigation"
      expanded={isOpen}
      isFixedNav
      className="sidebar"
    >
      <SideNavItems>
        <SideNavLink
          renderIcon={Dashboard}
          href="#"
          isActive={isActive('/dashboard')}
          onClick={(e) => {
            e.preventDefault();
            handleNavigation('/dashboard');
          }}
        >
          Dashboard
        </SideNavLink>

        <SideNavMenu
          renderIcon={Cube}
          title="Components"
          defaultExpanded={currentPath.startsWith('/components')}
        >
          <SideNavMenuItem
            href="#"
            isActive={isActive('/components/select')}
            onClick={(e: any) => {
              e.preventDefault();
              handleNavigation('/components/select');
            }}
          >
            Select Components
          </SideNavMenuItem>
          <SideNavMenuItem
            href="#"
            isActive={isActive('/components/dependencies')}
            onClick={(e: any) => {
              e.preventDefault();
              handleNavigation('/components/dependencies');
            }}
          >
            View Dependencies
          </SideNavMenuItem>
        </SideNavMenu>

        <SideNavMenu
          renderIcon={Settings}
          title="Configuration"
          defaultExpanded={currentPath.startsWith('/configuration')}
        >
          <SideNavMenuItem
            href="#"
            isActive={isActive('/configuration/edit')}
            onClick={(e: any) => {
              e.preventDefault();
              handleNavigation('/configuration/edit');
            }}
          >
            Edit Configuration
          </SideNavMenuItem>
          <SideNavMenuItem
            href="#"
            isActive={isActive('/configuration/preview')}
            onClick={(e: any) => {
              e.preventDefault();
              handleNavigation('/configuration/preview');
            }}
          >
            Preview YAML
          </SideNavMenuItem>
          <SideNavMenuItem
            href="#"
            isActive={isActive('/configuration/validate')}
            onClick={(e: any) => {
              e.preventDefault();
              handleNavigation('/configuration/validate');
            }}
          >
            Validate
          </SideNavMenuItem>
        </SideNavMenu>

        <SideNavMenu
          renderIcon={Rocket}
          title="Deployment"
          defaultExpanded={currentPath.startsWith('/deployment')}
        >
          <SideNavMenuItem
            href="#"
            isActive={isActive('/deployment/start')}
            onClick={(e: any) => {
              e.preventDefault();
              handleNavigation('/deployment/start');
            }}
          >
            Start Deployment
          </SideNavMenuItem>
          <SideNavMenuItem
            href="#"
            isActive={isActive('/deployment/status')}
            onClick={(e: any) => {
              e.preventDefault();
              handleNavigation('/deployment/status');
            }}
          >
            Deployment Status
          </SideNavMenuItem>
          <SideNavMenuItem
            href="#"
            isActive={isActive('/deployment/logs')}
            onClick={(e: any) => {
              e.preventDefault();
              handleNavigation('/deployment/logs');
            }}
          >
            View Logs
          </SideNavMenuItem>
        </SideNavMenu>

        <SideNavLink
          renderIcon={ChartLine}
          href="#"
          isActive={isActive('/history')}
          onClick={(e) => {
            e.preventDefault();
            handleNavigation('/history');
          }}
        >
          Deployment History
        </SideNavLink>

        <SideNavLink
          renderIcon={Document}
          href="#"
          isActive={isActive('/documentation')}
          onClick={(e) => {
            e.preventDefault();
            handleNavigation('/documentation');
          }}
        >
          Documentation
        </SideNavLink>
      </SideNavItems>
    </SideNav>
  );
};

export default Sidebar;

// Made with Bob
