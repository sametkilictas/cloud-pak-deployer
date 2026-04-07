/**
 * Dashboard Page
 * Main landing page after authentication
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tile,
  Button,
  Grid,
  Column,
} from '@carbon/react';
import {
  Cube,
  Settings,
  Rocket,
  DocumentView,
  ChartLine,
} from '@carbon/icons-react';
import { useAuthStore } from '../stores/authStore';
import { ROUTES } from '../constants/routes';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { clusterInfo, user } = useAuthStore();

  const quickActions = [
    {
      title: 'Select Components',
      description: 'Choose Cloud Pak components to deploy',
      icon: Cube,
      route: ROUTES.COMPONENTS,
      color: '#0f62fe',
    },
    {
      title: 'Configure Deployment',
      description: 'Set up deployment parameters',
      icon: Settings,
      route: ROUTES.CONFIGURATION,
      color: '#8a3ffc',
    },
    {
      title: 'Start Deployment',
      description: 'Begin the deployment process',
      icon: Rocket,
      route: ROUTES.DEPLOYMENT,
      color: '#24a148',
    },
    {
      title: 'View History',
      description: 'Check past deployments',
      icon: ChartLine,
      route: ROUTES.HISTORY,
      color: '#fa4d56',
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome to Cloud Pak Deployer</h1>
        <p className="dashboard-subtitle">
          Deploy and manage IBM Cloud Pak for Data, Integration, and Business Automation
        </p>
      </div>

      {clusterInfo && (
        <Tile className="cluster-info-tile">
          <h2>Connected Cluster</h2>
          <div className="cluster-details">
            <div className="cluster-detail">
              <span className="label">Cluster Name:</span>
              <span className="value">{clusterInfo.name}</span>
            </div>
            <div className="cluster-detail">
              <span className="label">OpenShift Version:</span>
              <span className="value">{clusterInfo.version}</span>
            </div>
            <div className="cluster-detail">
              <span className="label">API URL:</span>
              <span className="value">{clusterInfo.apiUrl}</span>
            </div>
            <div className="cluster-detail">
              <span className="label">User:</span>
              <span className="value">{user || 'admin'}</span>
            </div>
          </div>
        </Tile>
      )}

      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <Grid>
          {quickActions.map((action) => (
            <Column key={action.title} sm={4} md={4} lg={4}>
              <Tile
                className="action-tile"
                onClick={() => navigate(action.route)}
                style={{ borderTopColor: action.color }}
              >
                <div className="action-icon" style={{ color: action.color }}>
                  <action.icon size={32} />
                </div>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
                <Button
                  kind="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(action.route);
                  }}
                >
                  Get Started
                </Button>
              </Tile>
            </Column>
          ))}
        </Grid>
      </div>

      <div className="getting-started-section">
        <Tile>
          <h2>Getting Started</h2>
          <ol className="steps-list">
            <li>
              <strong>Select Components:</strong> Choose which Cloud Pak components you want to deploy
            </li>
            <li>
              <strong>Review Dependencies:</strong> The system will automatically resolve and show required dependencies
            </li>
            <li>
              <strong>Configure Settings:</strong> Customize deployment parameters for each component
            </li>
            <li>
              <strong>Preview Configuration:</strong> Review the generated YAML configuration
            </li>
            <li>
              <strong>Deploy:</strong> Start the deployment and monitor progress in real-time
            </li>
          </ol>
          <Button
            kind="primary"
            renderIcon={DocumentView}
            onClick={() => window.open('https://github.com/IBM/cloud-pak-deployer', '_blank')}
          >
            View Documentation
          </Button>
        </Tile>
      </div>
    </div>
  );
};

// Made with Bob
