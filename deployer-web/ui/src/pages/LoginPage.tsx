/**
 * Login Page
 * OpenShift cluster authentication page
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextInput,
  Button,
  Form,
  Stack,
  InlineNotification,
} from '@carbon/react';
import { Login } from '@carbon/icons-react';
import { useAuthStore } from '../stores/authStore';
import { ROUTES } from '../constants/routes';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, isLoading } = useAuthStore();
  const [command, setCommand] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(command);
      // Navigate to dashboard on successful login
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      // Error is handled by the store
      console.error('Login failed:', err);
    }
  };

  return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <h1 className="login-title">Cloud Pak Deployer</h1>
            <p className="login-subtitle">
              Deploy IBM Cloud Pak for Data, Integration, and Business Automation
            </p>
          </div>

          <div className="login-card">
            <h2 className="login-card-title">Connect to OpenShift Cluster</h2>
            <p className="login-card-description">
              Enter your OpenShift login command to authenticate and connect to your cluster.
            </p>

            {error && (
              <InlineNotification
                kind="error"
                title="Authentication Failed"
                subtitle={error}
                onCloseButtonClick={() => useAuthStore.getState().clearError()}
                className="login-error"
              />
            )}

            <Form onSubmit={handleSubmit}>
              <Stack gap={6}>
                <TextInput
                  id="oc-login-command"
                  labelText="OpenShift Login Command"
                  placeholder="oc login --token=sha256~... --server=https://..."
                  value={command}
                  onChange={(e: any) => setCommand(e.target.value)}
                  disabled={isLoading}
                  helperText="Paste the complete 'oc login' command from your OpenShift console"
                  type="text"
                />

                <Button
                  type="submit"
                  renderIcon={Login}
                  disabled={isLoading || !command.trim()}
                  className="login-button"
                >
                  {isLoading ? 'Connecting...' : 'Connect to Cluster'}
                </Button>
              </Stack>
            </Form>

            <div className="login-help">
              <h3>How to get your login command:</h3>
              <ol>
                <li>Open your OpenShift web console</li>
                <li>Click on your username in the top right corner</li>
                <li>Select "Copy login command"</li>
                <li>Click "Display Token"</li>
                <li>Copy the full "oc login" command</li>
                <li>Paste it in the field above</li>
              </ol>
            </div>
          </div>

          <div className="login-footer">
            <p>
              Need help? Check the{' '}
              <a href="https://github.com/IBM/cloud-pak-deployer" target="_blank" rel="noopener noreferrer">
                documentation
              </a>
            </p>
          </div>
        </div>
      </div>
  );
};

// Made with Bob
