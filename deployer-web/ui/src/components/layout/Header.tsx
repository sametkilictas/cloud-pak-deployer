/**
 * Header Component
 * 
 * Main application header with navigation and user controls.
 * Uses IBM Carbon Design System HeaderContainer pattern.
 * 
 * Features:
 * - IBM Carbon header styling
 * - Navigation menu
 * - User profile dropdown
 * - OpenShift cluster info
 * - Logout functionality
 */

import React from 'react';
import {
  Header as CarbonHeader,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent
} from '@carbon/react';
import { UserAvatar, Logout, Information, Asleep, Light } from '@carbon/icons-react';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import './Header.css';

interface HeaderProps {
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { isAuthenticated, user, clusterInfo, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    logout();
    if (onNavigate) {
      onNavigate('/login');
    }
  };

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <HeaderContainer
      render={() => (
        <>
          <CarbonHeader aria-label="Cloud Pak Deployer">
            <SkipToContent />
            
            <HeaderName
              href="#"
              prefix="IBM"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/');
              }}
            >
              Cloud Pak Deployer
            </HeaderName>

            {isAuthenticated && (
              <>
                <HeaderNavigation aria-label="Main Navigation">
                  <HeaderMenuItem
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation('/dashboard');
                    }}
                  >
                    Dashboard
                  </HeaderMenuItem>
                  <HeaderMenuItem
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation('/components');
                    }}
                  >
                    Components
                  </HeaderMenuItem>
                  <HeaderMenuItem
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation('/configuration');
                    }}
                  >
                    Configuration
                  </HeaderMenuItem>
                  <HeaderMenuItem
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation('/deployment');
                    }}
                  >
                    Deployment
                  </HeaderMenuItem>
                </HeaderNavigation>

                <HeaderGlobalBar>
                  {clusterInfo && (
                    <div className="header__cluster-info">
                      <Information size={16} />
                      <span className="header__cluster-name">
                        {clusterInfo.name}
                      </span>
                      <span className="header__cluster-version">
                        v{clusterInfo.version}
                      </span>
                    </div>
                  )}

                  {user && (
                    <div className="header__user-info">
                      <UserAvatar size={16} />
                      <span className="header__username">{user}</span>
                    </div>
                  )}

                  <HeaderGlobalAction
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                    tooltipAlignment="end"
                    onClick={toggleTheme}
                  >
                    {theme === 'light' ? <Asleep size={20} /> : <Light size={20} />}
                  </HeaderGlobalAction>

                  <HeaderGlobalAction
                    aria-label="Logout"
                    tooltipAlignment="end"
                    onClick={handleLogout}
                  >
                    <Logout size={20} />
                  </HeaderGlobalAction>
                </HeaderGlobalBar>
              </>
            )}
          </CarbonHeader>
        </>
      )}
    />
  );
};

export default Header;

// Made with Bob
