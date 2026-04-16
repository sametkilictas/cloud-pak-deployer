/**
 * Deployment Page
 * 
 * Manages Cloud Pak deployment process with real-time progress tracking.
 * Features:
 * - Pre-deployment summary and validation
 * - Real-time deployment progress with stage indicators
 * - Live log streaming
 * - Deployment controls (start, stop, pause)
 * - Post-deployment summary with access credentials
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  InlineNotification,
  ProgressBar,
  Tile,
  Modal,
  Tag,
  Accordion,
  AccordionItem,
  Loading,
} from '@carbon/react';
import {
  Rocket,
  CheckmarkFilled,
  WarningAlt,
  StopFilled,
  ArrowLeft,
  Launch,
  Copy,
  Download,
  Renew,
} from '@carbon/icons-react';
import { useDeploymentStore } from '../stores/deploymentStore';
import { useConfigStore } from '../stores/configStore';
import { useComponentStore } from '../stores/componentStore';
import { LogViewer } from '../components/common/LogViewer';
import { ROUTES } from '../constants/routes';
import './DeploymentPage.css';

export const DeploymentPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    status,
    logs,
    isDeploying,
    error,
    startDeployment,
    stopDeployment,
    resetDeployment,
    downloadLogs,
    clearLogs,
  } = useDeploymentStore();

  const { configuration, generateYAML, validateConfiguration } = useConfigStore();
  const { getSelectedComponentsList } = useComponentStore();

  const [showStopModal, setShowStopModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Get selected components for summary
  const selectedComponents = useMemo(() => {
    return getSelectedComponentsList();
  }, [getSelectedComponentsList]);

  // Validate configuration on mount
  useEffect(() => {
    const isValid = validateConfiguration();
    if (!isValid) {
      setValidationErrors(['Configuration validation failed. Please review your settings.']);
    }
  }, [validateConfiguration]);

  // Calculate deployment progress
  const deploymentProgress = useMemo(() => {
    if (!status.deployer_active && status.completion_state === 'Successful') {
      return 100;
    }
    return status.percentage_completed || 0;
  }, [status]);

  // Determine deployment state
  const deploymentState = useMemo(() => {
    if (status.completion_state === 'Successful') return 'success';
    if (status.completion_state === 'Failed') return 'error';
    if (error) return 'error';
    if (isDeploying) return 'active';
    return 'idle';
  }, [status, error, isDeploying]);

  // Handle start deployment
  const handleStartDeployment = async () => {
    setShowStartModal(false);
    await startDeployment();
  };

  // Handle stop deployment
  const handleStopDeployment = () => {
    setShowStopModal(false);
    stopDeployment();
  };

  // Handle reset and start new deployment
  const handleNewDeployment = () => {
    resetDeployment();
    clearLogs();
  };

  // Copy credentials to clipboard
  const handleCopyCredentials = () => {
    if (status.cp4d_url && status.cp4d_user && status.cp4d_password) {
      const credentials = `URL: ${status.cp4d_url}\nUsername: ${status.cp4d_user}\nPassword: ${status.cp4d_password}`;
      navigator.clipboard.writeText(credentials);
    }
  };

  // Render pre-deployment summary
  const renderPreDeploymentSummary = () => (
    <div className="deployment-page__pre-deployment">
      <Tile className="deployment-summary-tile">
        <h2>Deployment Summary</h2>
        
        {validationErrors.length > 0 && (
          <InlineNotification
            kind="error"
            title="Configuration Errors"
            subtitle="Please fix the following errors before deploying"
            hideCloseButton
          />
        )}

        <div className="deployment-summary__section">
          <h3>Selected Components ({selectedComponents.length})</h3>
          <div className="deployment-summary__components">
            {selectedComponents.map((component) => (
              <Tag key={component.id} type="blue" size="md">
                {component.name}
              </Tag>
            ))}
          </div>
        </div>

        <div className="deployment-summary__section">
          <h3>Environment Configuration</h3>
          <div className="deployment-summary__config">
            <div className="config-item">
              <span className="label">Environment:</span>
              <span className="value">{configuration?.global_config?.environment_name || 'demo'}</span>
            </div>
            <div className="config-item">
              <span className="label">Platform:</span>
              <span className="value">{configuration?.global_config?.cloud_platform || 'existing-ocp'}</span>
            </div>
            <div className="config-item">
              <span className="label">CP4D Version:</span>
              <span className="value">{configuration?.cp4d?.[0]?.cp4d_version || 'latest'}</span>
            </div>
          </div>
        </div>

        <div className="deployment-summary__actions">
          <Button
            kind="secondary"
            renderIcon={ArrowLeft}
            onClick={() => navigate(ROUTES.CONFIGURATION)}
          >
            Back to Configuration
          </Button>
          <Button
            kind="primary"
            renderIcon={Rocket}
            onClick={() => setShowStartModal(true)}
            disabled={validationErrors.length > 0 || selectedComponents.length === 0}
          >
            Start Deployment
          </Button>
        </div>
      </Tile>
    </div>
  );

  // Render active deployment
  const renderActiveDeployment = () => (
    <div className="deployment-page__active">
      {/* Progress Section */}
      <Tile className="deployment-progress-tile">
        <div className="deployment-progress__header">
          <h2>Deployment in Progress</h2>
          <Tag type="blue" renderIcon={Loading}>
            {status.deployer_stage || 'Initializing'}
          </Tag>
        </div>

        <div className="deployment-progress__bar">
          <ProgressBar
            label="Overall Progress"
            value={deploymentProgress}
            max={100}
            helperText={status.last_step || 'Starting deployment...'}
          />
          <span className="progress-percentage">{deploymentProgress}%</span>
        </div>

        <div className="deployment-progress__stage">
          <p className="stage-label">Current Stage:</p>
          <p className="stage-value">{status.deployer_stage || 'validate'}</p>
        </div>

        <div className="deployment-progress__actions">
          <Button
            kind="danger"
            renderIcon={StopFilled}
            onClick={() => setShowStopModal(true)}
          >
            Stop Deployment
          </Button>
          <Button
            kind="ghost"
            renderIcon={Download}
            onClick={downloadLogs}
          >
            Download Logs
          </Button>
        </div>
      </Tile>

      {/* Logs Section */}
      <div className="deployment-logs-section">
        <LogViewer
          logs={logs}
          isStreaming={isDeploying}
          onClear={clearLogs}
          title="Deployment Logs"
        />
      </div>
    </div>
  );

  // Render post-deployment summary
  const renderPostDeployment = () => {
    const isSuccess = status.completion_state === 'Successful';

    return (
      <div className="deployment-page__post-deployment">
        <Tile className={`deployment-result-tile deployment-result-tile--${isSuccess ? 'success' : 'error'}`}>
          <div className="deployment-result__header">
            {isSuccess ? (
              <>
                <CheckmarkFilled size={48} className="result-icon result-icon--success" />
                <h2>Deployment Successful!</h2>
              </>
            ) : (
              <>
                <WarningAlt size={48} className="result-icon result-icon--error" />
                <h2>Deployment Failed</h2>
              </>
            )}
          </div>

          {isSuccess && status.cp4d_url && (
            <div className="deployment-result__credentials">
              <h3>Access Information</h3>
              <div className="credentials-grid">
                <div className="credential-item">
                  <span className="credential-label">Cloud Pak URL:</span>
                  <div className="credential-value">
                    <code>{status.cp4d_url}</code>
                    <Button
                      kind="ghost"
                      size="sm"
                      renderIcon={Launch}
                      onClick={() => window.open(status.cp4d_url, '_blank')}
                      hasIconOnly
                      iconDescription="Open in new tab"
                    />
                  </div>
                </div>
                <div className="credential-item">
                  <span className="credential-label">Username:</span>
                  <div className="credential-value">
                    <code>{status.cp4d_user}</code>
                  </div>
                </div>
                <div className="credential-item">
                  <span className="credential-label">Password:</span>
                  <div className="credential-value">
                    <code>{status.cp4d_password}</code>
                  </div>
                </div>
              </div>
              <Button
                kind="tertiary"
                size="sm"
                renderIcon={Copy}
                onClick={handleCopyCredentials}
              >
                Copy All Credentials
              </Button>
            </div>
          )}

          {!isSuccess && error && (
            <InlineNotification
              kind="error"
              title="Deployment Error"
              subtitle={error}
              hideCloseButton
            />
          )}

          <div className="deployment-result__actions">
            <Button
              kind="secondary"
              renderIcon={ArrowLeft}
              onClick={() => navigate(ROUTES.DASHBOARD)}
            >
              Back to Dashboard
            </Button>
            <Button
              kind="primary"
              renderIcon={Renew}
              onClick={handleNewDeployment}
            >
              Start New Deployment
            </Button>
          </div>
        </Tile>

        {/* Deployment Logs Accordion */}
        <Accordion>
          <AccordionItem title={`View Deployment Logs (${logs.length} entries)`}>
            <LogViewer
              logs={logs}
              isStreaming={false}
              onClear={clearLogs}
              title="Deployment Logs"
            />
          </AccordionItem>
        </Accordion>
      </div>
    );
  };

  return (
    <div className="deployment-page">
      <div className="deployment-page__header">
        <h1>Cloud Pak Deployment</h1>
        <p className="deployment-page__subtitle">
          Deploy your configured Cloud Pak components to OpenShift
        </p>
      </div>

      {/* Render appropriate view based on deployment state */}
      {deploymentState === 'idle' && renderPreDeploymentSummary()}
      {deploymentState === 'active' && renderActiveDeployment()}
      {(deploymentState === 'success' || deploymentState === 'error') && renderPostDeployment()}

      {/* Start Deployment Confirmation Modal */}
      <Modal
        open={showStartModal}
        onRequestClose={() => setShowStartModal(false)}
        modalHeading="Start Deployment"
        primaryButtonText="Start"
        secondaryButtonText="Cancel"
        onRequestSubmit={handleStartDeployment}
        danger={false}
      >
        <p>
          Are you sure you want to start the deployment? This will deploy{' '}
          <strong>{selectedComponents.length} component(s)</strong> to your OpenShift cluster.
        </p>
        <p style={{ marginTop: '1rem' }}>
          The deployment process may take 30-60 minutes depending on the number of components.
        </p>
      </Modal>

      {/* Stop Deployment Confirmation Modal */}
      <Modal
        open={showStopModal}
        onRequestClose={() => setShowStopModal(false)}
        modalHeading="Stop Deployment"
        primaryButtonText="Stop"
        secondaryButtonText="Cancel"
        onRequestSubmit={handleStopDeployment}
        danger
      >
        <p>
          Are you sure you want to stop the deployment? This action cannot be undone and may leave
          your cluster in an inconsistent state.
        </p>
        <p style={{ marginTop: '1rem' }}>
          It is recommended to let the deployment complete or fail naturally.
        </p>
      </Modal>
    </div>
  );
};

// Made with Bob