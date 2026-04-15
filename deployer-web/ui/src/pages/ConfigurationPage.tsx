/**
 * ConfigurationPage Component
 *
 * Main configuration page that integrates all configuration sections:
 * - Global configuration (environment, platform settings)
 * - Component configuration (individual component settings)
 * - YAML preview (real-time generated configuration)
 *
 * Features two-panel layout with configuration forms on left and YAML preview on right.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  InlineNotification,
  Modal,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Loading,
  TextInput,
  TextArea,
} from '@carbon/react';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Download,
  Upload,
  Renew,
  Checkmark,
  WarningAlt,
  CheckmarkOutline,
} from '@carbon/icons-react';
import { useConfigStore } from '../stores/configStore';
import { useComponentStore } from '../stores/componentStore';
import { GlobalConfigSection } from '../components/configuration/GlobalConfigSection';
import { ComponentConfigSection } from '../components/configuration/ComponentConfigSection';
import { YAMLPreview } from '../components/configuration/YAMLPreview';
import { TestConfigModal } from '../components/configuration/TestConfigModal';
import './ConfigurationPage.css';

export const ConfigurationPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    configuration,
    initializeConfig,
    generateYAML,
    validateConfiguration,
    saveConfiguration,
    exportConfiguration,
    importConfiguration,
    resetConfiguration,
    isDirty,
    validationErrors,
  } = useConfigStore();

  const { getSelectedComponentsList } = useComponentStore();

  const [activeTab, setActiveTab] = useState(0);
  const [globalConfigValid, setGlobalConfigValid] = useState(true);
  const [componentConfigValid, setComponentConfigValid] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [configName, setConfigName] = useState('');
  const [configDescription, setConfigDescription] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Initialize configuration on mount
  useEffect(() => {
    if (!configuration) {
      initializeConfig();
    }
  }, [configuration, initializeConfig]);

  // Sync selected components to configuration cartridges (only on initial load)
  useEffect(() => {
    if (!configuration) return;

    const selectedComponents = getSelectedComponentsList();
    
    // Get existing cartridges from configuration
    const existingCartridges = configuration.cp4d[0]?.cartridges || [];
    const existingCartridgeMap = new Map(existingCartridges.map(c => [c.name, c]));
    
    // Check if sync is needed (only if there are selected components but no cartridges)
    const needsSync = selectedComponents.length > 0 && existingCartridges.length === 0;
    
    if (needsSync) {
      // Create cartridges for selected components, preserving any existing configuration
      // CRITICAL: Use component.originalName for cartridge name (not component.id)
      const newCartridges = selectedComponents.map(component => {
        const existing = existingCartridgeMap.get(component.originalName);
        return existing || {
          name: component.originalName, // ← Use originalName for backend compatibility
          state: 'installed' as const,
          description: component.description,
          size: 'small' as const,
        };
      });
      
      // Update configuration with new cartridges
      const updatedConfig = {
        ...configuration,
        cp4d: [
          {
            ...configuration.cp4d[0],
            cartridges: newCartridges
          }
        ]
      };
      
      // Use the store's internal state update to avoid triggering dirty flag
      useConfigStore.setState({ configuration: updatedConfig });
    }
  }, [configuration, getSelectedComponentsList]);

  // Generate YAML for preview
  const yamlContent = useMemo(() => {
    return generateYAML();
  }, [generateYAML, configuration]);

  // Convert validation errors to array format for YAMLPreview
  const yamlErrors = useMemo(() => {
    const errorArray: Array<{ field: string; message: string; severity: 'error' | 'warning' }> = [];
    Object.entries(validationErrors).forEach(([field, messages]) => {
      messages.forEach(message => {
        errorArray.push({ field, message, severity: 'error' });
      });
    });
    return errorArray;
  }, [validationErrors]);

  // Get selected components count
  const selectedComponents = useMemo(() => {
    return getSelectedComponentsList();
  }, [getSelectedComponentsList]);

  // Calculate overall validation status
  const isValid = useMemo(() => {
    return globalConfigValid && componentConfigValid && Object.keys(validationErrors).length === 0;
  }, [globalConfigValid, componentConfigValid, validationErrors]);

  // Handle navigation back to component selection
  const handleBack = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to go back?'
      );
      if (!confirmed) return;
    }
    navigate('/components');
  };

  // Handle navigation to deployment
  const handleNext = () => {
    const valid = validateConfiguration();
    if (!valid) {
      alert('Please fix validation errors before proceeding to deployment.');
      return;
    }
    navigate('/deployment');
  };

  // Handle save configuration
  const handleSave = () => {
    setShowSaveModal(true);
  };

  const handleSaveConfirm = () => {
    if (!configName.trim()) {
      alert('Please enter a configuration name.');
      return;
    }
    saveConfiguration(configName, configDescription);
    setShowSaveModal(false);
    setConfigName('');
    setConfigDescription('');
  };

  // Handle export configuration
  const handleExport = () => {
    exportConfiguration();
  };

  // Handle import configuration
  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.yaml') && !file.name.endsWith('.yml')) {
      alert('Please select a valid YAML file (.yaml or .yml)');
      return;
    }

    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        try {
          importConfiguration(content);
          alert('Configuration imported successfully!');
        } catch (error) {
          alert('Failed to import configuration. Please check the file format.');
        }
      }
    };
    reader.onerror = () => {
      alert('Failed to read file. Please try again.');
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle reset configuration
  const handleReset = () => {
    setShowResetModal(true);
  };

  const handleResetConfirm = () => {
    resetConfiguration();
    setShowResetModal(false);
  };

  // Handle validation change from sections
  const handleGlobalValidationChange = (valid: boolean) => {
    setGlobalConfigValid(valid);
  };

  const handleComponentValidationChange = (valid: boolean) => {
    setComponentConfigValid(valid);
  };

  if (!configuration) {
    return (
      <div className="configuration-page configuration-page--loading">
        <Loading description="Loading configuration..." withOverlay={false} />
      </div>
    );
  }

  return (
    <div className="configuration-page">
      {/* Header */}
      <div className="configuration-page__header">
        <div className="configuration-page__header-content">
          <h1 className="configuration-page__title">Configuration</h1>
          <p className="configuration-page__description">
            Configure global settings and individual component options for your Cloud Pak deployment.
          </p>
        </div>
        <div className="configuration-page__header-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept=".yaml,.yml"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Button
            kind="tertiary"
            size="md"
            renderIcon={CheckmarkOutline}
            onClick={() => setShowTestModal(true)}
            disabled={!configuration || selectedComponents.length === 0}
          >
            Test Config
          </Button>
          <Button
            kind="secondary"
            size="md"
            renderIcon={Upload}
            onClick={handleImport}
          >
            Import
          </Button>
          <Button
            kind="secondary"
            size="md"
            renderIcon={Download}
            onClick={handleExport}
            disabled={!configuration}
          >
            Export
          </Button>
          <Button
            kind="secondary"
            size="md"
            renderIcon={Save}
            onClick={handleSave}
            disabled={!isDirty}
          >
            Save
          </Button>
          <Button
            kind="danger--tertiary"
            size="md"
            renderIcon={Renew}
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="configuration-page__status">
        <div className="configuration-page__status-item">
          <span className="configuration-page__status-label">Selected Components:</span>
          <span className="configuration-page__status-value">{selectedComponents.length}</span>
        </div>
        <div className="configuration-page__status-item">
          <span className="configuration-page__status-label">Validation:</span>
          <span className={`configuration-page__status-value ${isValid ? 'valid' : 'invalid'}`}>
            {isValid ? (
              <>
                <Checkmark size={16} /> Valid
              </>
            ) : (
              <>
                <WarningAlt size={16} /> Invalid
              </>
            )}
          </span>
        </div>
        <div className="configuration-page__status-item">
          <span className="configuration-page__status-label">Changes:</span>
          <span className="configuration-page__status-value">
            {isDirty ? 'Unsaved' : 'Saved'}
          </span>
        </div>
      </div>

      {/* Validation Errors */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="configuration-page__errors">
          <InlineNotification
            kind="error"
            title="Configuration Validation Errors"
            subtitle={`Please fix ${Object.keys(validationErrors).length} validation ${
              Object.keys(validationErrors).length === 1 ? 'error' : 'errors'
            } before proceeding.`}
            lowContrast
            hideCloseButton
          />
        </div>
      )}

      {/* Main Content - Two Panel Layout */}
      <div className="configuration-page__content">
        {/* Left Panel - Configuration Forms */}
        <div className="configuration-page__panel configuration-page__panel--left">
          <Tabs selectedIndex={activeTab} onChange={(e) => setActiveTab(e.selectedIndex)}>
            <TabList aria-label="Configuration sections" contained>
              <Tab>Global Configuration</Tab>
              <Tab>Component Configuration</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div className="configuration-page__tab-content">
                  <GlobalConfigSection
                    config={configuration?.global_config || {}}
                    onChange={(field, value) => {
                      // Update global config through store
                      const updates: any = {};
                      updates[field] = value;
                      useConfigStore.getState().updateGlobalConfig(updates);
                    }}
                    errors={validationErrors}
                  />
                </div>
              </TabPanel>
              <TabPanel>
                <div className="configuration-page__tab-content">
                  {selectedComponents.length > 0 ? (
                    <ComponentConfigSection onValidationChange={handleComponentValidationChange} />
                  ) : (
                    <div className="configuration-page__empty-state">
                      <InlineNotification
                        kind="info"
                        title="No components selected"
                        subtitle="Go back to the Component Selection page to select components for your deployment."
                        hideCloseButton
                      />
                      <Button
                        kind="primary"
                        size="md"
                        onClick={() => navigate('/components')}
                      >
                        Select Components
                      </Button>
                    </div>
                  )}
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>

        {/* Right Panel - YAML Preview */}
        <div className="configuration-page__panel configuration-page__panel--right">
          <YAMLPreview
            yaml={yamlContent}
            errors={yamlErrors}
            onCopy={() => {/* Handled by YAMLPreview */}}
            onDownload={() => {/* Handled by YAMLPreview */}}
          />
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="configuration-page__footer">
        <Button
          kind="secondary"
          size="lg"
          renderIcon={ArrowLeft}
          onClick={handleBack}
        >
          Back to Components
        </Button>
        <Button
          kind="primary"
          size="lg"
          renderIcon={ArrowRight}
          iconDescription="Next"
          onClick={handleNext}
          disabled={!isValid}
        >
          Continue to Deployment
        </Button>
      </div>

      {/* Save Configuration Modal */}
      <Modal
        open={showSaveModal}
        onRequestClose={() => setShowSaveModal(false)}
        onRequestSubmit={handleSaveConfirm}
        modalHeading="Save Configuration"
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
        size="sm"
      >
        <div className="configuration-page__modal-content">
          <div className="configuration-page__modal-field">
            <label htmlFor="config-name">Configuration Name *</label>
            <input
              id="config-name"
              type="text"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              placeholder="Enter configuration name"
              className="configuration-page__modal-input"
            />
          </div>
          <div className="configuration-page__modal-field">
            <label htmlFor="config-description">Description</label>
            <textarea
              id="config-description"
              value={configDescription}
              onChange={(e) => setConfigDescription(e.target.value)}
              placeholder="Enter optional description"
              rows={3}
              className="configuration-page__modal-textarea"
            />
          </div>
        </div>
      </Modal>

      {/* Reset Configuration Modal */}
      <Modal
        open={showResetModal}
        onRequestClose={() => setShowResetModal(false)}
        onRequestSubmit={handleResetConfirm}
        modalHeading="Reset Configuration"
        primaryButtonText="Reset"
        secondaryButtonText="Cancel"
        danger
        size="sm"
      >
        <p>
          Are you sure you want to reset the configuration? This will discard all changes and
          restore the default configuration.
        </p>
      </Modal>

      {/* Test Configuration Modal */}
      <TestConfigModal
        open={showTestModal}
        onClose={() => setShowTestModal(false)}
      />
    </div>
  );
};

export default ConfigurationPage;

// Made with Bob