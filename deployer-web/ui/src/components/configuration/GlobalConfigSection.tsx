/**
 * GlobalConfigSection Component
 * 
 * Handles global configuration settings for Cloud Pak deployment.
 * Includes environment name, cloud platform, optimization settings, etc.
 */

import React, { useCallback, useMemo } from 'react';
import {
  TextInput,
  Select,
  SelectItem,
  Toggle,
  FormGroup,
  InlineNotification,
  Accordion,
  AccordionItem
} from '@carbon/react';
import { Information } from '@carbon/icons-react';
import './GlobalConfigSection.css';

interface GlobalConfigSectionProps {
  config: {
    environment_name?: string;
    cloud_platform?: string;
    confirm_destroy?: boolean;
    optimize_deploy?: boolean;
    env_id?: string;
  };
  onChange: (field: string, value: any) => void;
  errors?: Record<string, string[]>;
  disabled?: boolean;
}

export const GlobalConfigSection: React.FC<GlobalConfigSectionProps> = ({
  config,
  onChange,
  errors = {},
  disabled = false
}) => {
  // Cloud platform options
  const cloudPlatforms = useMemo(() => [
    { value: 'existing-ocp', label: 'Existing OpenShift' },
    { value: 'aws', label: 'AWS' },
    { value: 'azure', label: 'Azure' },
    { value: 'ibm-cloud', label: 'IBM Cloud' },
    { value: 'vsphere', label: 'VMware vSphere' }
  ], []);

  // Handle field change
  const handleChange = useCallback((field: string, value: any) => {
    onChange(field, value);
  }, [onChange]);

  // Get error for a field
  const getFieldError = useCallback((field: string): string | undefined => {
    return errors[field]?.[0];
  }, [errors]);

  // Check if field has error
  const hasError = useCallback((field: string): boolean => {
    return !!errors[field] && errors[field].length > 0;
  }, [errors]);

  return (
    <div className="global-config-section">
      <div className="global-config-section__header">
        <h3 className="global-config-section__title">Global Configuration</h3>
        <p className="global-config-section__description">
          Configure global settings that apply to the entire deployment
        </p>
      </div>

      <div className="global-config-section__content">
        {/* Basic Settings */}
        <div className="global-config-section__group">
          <h4 className="global-config-section__group-title">Basic Settings</h4>
          
          <FormGroup legendText="">
            <div className="global-config-section__fields">
              {/* Environment Name */}
              <div className="global-config-section__field">
                <TextInput
                  id="environment_name"
                  labelText="Environment Name"
                  value={config.environment_name || ''}
                  onChange={(e) => handleChange('environment_name', e.target.value)}
                  invalid={hasError('environment_name')}
                  invalidText={getFieldError('environment_name')}
                  disabled={disabled}
                  placeholder="e.g., demo, production, development"
                  helperText="A descriptive name for this deployment environment"
                />
              </div>

              {/* Environment ID */}
              <div className="global-config-section__field">
                <TextInput
                  id="env_id"
                  labelText="Environment ID"
                  value={config.env_id || ''}
                  onChange={(e) => handleChange('env_id', e.target.value)}
                  invalid={hasError('env_id')}
                  invalidText={getFieldError('env_id')}
                  disabled={disabled}
                  placeholder="e.g., cpd-demo"
                  helperText="Unique identifier for this environment (lowercase, alphanumeric with hyphens)"
                />
              </div>

              {/* Cloud Platform */}
              <div className="global-config-section__field global-config-section__field--full">
                <Select
                  id="cloud_platform"
                  labelText="Cloud Platform"
                  value={config.cloud_platform || 'existing-ocp'}
                  onChange={(e) => handleChange('cloud_platform', e.target.value)}
                  invalid={hasError('cloud_platform')}
                  invalidText={getFieldError('cloud_platform')}
                  disabled={disabled}
                  helperText="Select the target cloud platform for deployment"
                >
                  {cloudPlatforms.map(platform => (
                    <SelectItem
                      key={platform.value}
                      value={platform.value}
                      text={platform.label}
                    />
                  ))}
                </Select>
              </div>
            </div>
          </FormGroup>
        </div>

        {/* Deployment Options */}
        <Accordion>
          <AccordionItem title="Deployment Options" open={false}>
            <div className="global-config-section__accordion-content">
              <FormGroup legendText="">
                <div className="global-config-section__toggles">
                  {/* Optimize Deploy */}
                  <div className="global-config-section__toggle">
                    <Toggle
                      id="optimize_deploy"
                      labelText="Optimize Deployment"
                      labelA="Disabled"
                      labelB="Enabled"
                      toggled={config.optimize_deploy ?? true}
                      onToggle={(checked) => handleChange('optimize_deploy', checked)}
                      disabled={disabled}
                    />
                    <p className="global-config-section__toggle-help">
                      Enable deployment optimizations for faster installation
                    </p>
                  </div>

                  {/* Confirm Destroy */}
                  <div className="global-config-section__toggle">
                    <Toggle
                      id="confirm_destroy"
                      labelText="Confirm Before Destroy"
                      labelA="No"
                      labelB="Yes"
                      toggled={config.confirm_destroy ?? false}
                      onToggle={(checked) => handleChange('confirm_destroy', checked)}
                      disabled={disabled}
                    />
                    <p className="global-config-section__toggle-help">
                      Require confirmation before destroying resources
                    </p>
                  </div>
                </div>
              </FormGroup>

              {/* Warning for confirm_destroy */}
              {config.confirm_destroy === false && (
                <InlineNotification
                  kind="warning"
                  title="Warning"
                  subtitle="Resources will be destroyed without confirmation. Use with caution."
                  lowContrast
                  hideCloseButton
                />
              )}
            </div>
          </AccordionItem>
        </Accordion>

        {/* Information Notice */}
        <div className="global-config-section__notice">
          <InlineNotification
            kind="info"
            title="Configuration Template"
            subtitle="These settings will be applied to the generated config.yaml file"
            lowContrast
            hideCloseButton
          />
        </div>
      </div>
    </div>
  );
};

export default GlobalConfigSection;

// Made with Bob
