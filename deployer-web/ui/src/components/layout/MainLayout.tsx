/**
 * Main Layout Component
 * 
 * Primary layout wrapper that combines Header, Sidebar, and content area.
 * Provides consistent structure across all authenticated pages.
 * 
 * Features:
 * - Responsive layout
 * - Sidebar toggle
 * - Content area with proper spacing
 * - Breadcrumb support
 */

import React, { useState } from 'react';
import { Content, Breadcrumb, BreadcrumbItem } from '@carbon/react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import './MainLayout.css';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface MainLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
  breadcrumbs?: BreadcrumbItem[];
  onNavigate?: (path: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentPath = '/',
  breadcrumbs = [],
  onNavigate
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleBreadcrumbClick = (path?: string) => {
    if (path && onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className="main-layout">
      <Header onNavigate={onNavigate} />
      
      <div className="main-layout__container">
        <Sidebar
          isOpen={sidebarOpen}
          currentPath={currentPath}
          onNavigate={onNavigate}
        />
        
        <Content className="main-layout__content">
          {breadcrumbs.length > 0 && (
            <Breadcrumb className="main-layout__breadcrumb">
              {breadcrumbs.map((item, index) => (
                <BreadcrumbItem
                  key={index}
                  href={item.path ? '#' : undefined}
                  isCurrentPage={index === breadcrumbs.length - 1}
                  onClick={(e) => {
                    if (item.path) {
                      e.preventDefault();
                      handleBreadcrumbClick(item.path);
                    }
                  }}
                >
                  {item.label}
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
          )}
          
          <div className="main-layout__page">
            {children}
          </div>
        </Content>
      </div>
    </div>
  );
};

export default MainLayout;

// Made with Bob
