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
  config: any; // Full CloudPakConfig
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
          <AccordionItem title="Deployment Options" open={true}>
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

          {/* OpenShift Configuration */}
          <AccordionItem title="OpenShift Configuration" open={true}>
            <div className="global-config-section__accordion-content">
              <FormGroup legendText="">
                <div className="global-config-section__fields">
                  {/* OCP Version */}
                  <div className="global-config-section__field">
                    <TextInput
                      id="ocp_version"
                      labelText="OCP Version"
                      value={config.openshift?.[0]?.ocp_version || 'detect'}
                      onChange={(e) => handleChange('openshift.0.ocp_version', e.target.value)}
                      disabled={disabled}
                      placeholder="detect or specific version"
                      helperText="OpenShift version (use 'detect' for auto-detection)"
                    />
                  </div>

                  {/* Cluster Name */}
                  <div className="global-config-section__field">
                    <TextInput
                      id="cluster_name"
                      labelText="Cluster Name"
                      value={config.openshift?.[0]?.cluster_name || '{{ env_id }}'}
                      onChange={(e) => handleChange('openshift.0.cluster_name', e.target.value)}
                      disabled={disabled}
                      placeholder="{{ env_id }}"
                      helperText="OpenShift cluster name"
                    />
                  </div>

                  {/* Domain Name */}
                  <div className="global-config-section__field global-config-section__field--full">
                    <TextInput
                      id="domain_name"
                      labelText="Domain Name"
                      value={config.openshift?.[0]?.domain_name || 'example.com'}
                      onChange={(e) => handleChange('openshift.0.domain_name', e.target.value)}
                      disabled={disabled}
                      placeholder="example.com"
                      helperText="Domain name for the cluster"
                    />
                  </div>

                  {/* GPU Install */}
                  <div className="global-config-section__field">
                    <Select
                      id="gpu_install"
                      labelText="GPU Installation"
                      value={config.openshift?.[0]?.gpu?.install || 'auto'}
                      onChange={(e) => handleChange('openshift.0.gpu.install', e.target.value)}
                      disabled={disabled}
                      helperText="GPU operator installation"
                    >
                      <SelectItem value="auto" text="Auto" />
                      <SelectItem value="yes" text="Yes" />
                      <SelectItem value="no" text="No" />
                    </Select>
                  </div>

                  {/* OpenShift AI Install */}
                  <div className="global-config-section__field">
                    <Select
                      id="openshift_ai_install"
                      labelText="OpenShift AI"
                      value={config.openshift?.[0]?.openshift_ai?.install || 'auto'}
                      onChange={(e) => handleChange('openshift.0.openshift_ai.install', e.target.value)}
                      disabled={disabled}
                      helperText="OpenShift AI installation"
                    >
                      <SelectItem value="auto" text="Auto" />
                      <SelectItem value="yes" text="Yes" />
                      <SelectItem value="no" text="No" />
                    </Select>
                  </div>

                  {/* MCG Install */}
                  <div className="global-config-section__field global-config-section__field--full">
                    <Toggle
                      id="mcg_install"
                      labelText="Multi-Cloud Gateway (MCG)"
                      labelA="Disabled"
                      labelB="Enabled"
                      toggled={config.openshift?.[0]?.mcg?.install ?? false}
                      onToggle={(checked) => handleChange('openshift.0.mcg.install', checked)}
                      disabled={disabled}
                    />
                    <p className="global-config-section__toggle-help">
                      Enable Multi-Cloud Gateway for object storage
                    </p>
                  </div>
                </div>
              </FormGroup>
            </div>
          </AccordionItem>

          {/* CP4D Configuration */}
          <AccordionItem title="Cloud Pak for Data Configuration" open={true}>
            <div className="global-config-section__accordion-content">
              <FormGroup legendText="">
                <div className="global-config-section__fields">
                  {/* Project */}
                  <div className="global-config-section__field">
                    <TextInput
                      id="cp4d_project"
                      labelText="Project Name"
                      value={config.cp4d?.[0]?.project || 'cpd'}
                      onChange={(e) => handleChange('cp4d.0.project', e.target.value)}
                      disabled={disabled}
                      placeholder="cpd"
                      helperText="OpenShift project/namespace for CP4D"
                    />
                  </div>

                  {/* Operators Project */}
                  <div className="global-config-section__field">
                    <TextInput
                      id="operators_project"
                      labelText="Operators Project"
                      value={config.cp4d?.[0]?.operators_project || 'cpd-operators'}
                      onChange={(e) => handleChange('cp4d.0.operators_project', e.target.value)}
                      disabled={disabled}
                      placeholder="cpd-operators"
                      helperText="Project for CP4D operators"
                    />
                  </div>

                  {/* CP4D Version */}
                  <div className="global-config-section__field">
                    <TextInput
                      id="cp4d_version"
                      labelText="CP4D Version"
                      value={config.cp4d?.[0]?.cp4d_version || 'latest'}
                      onChange={(e) => handleChange('cp4d.0.cp4d_version', e.target.value)}
                      disabled={disabled}
                      placeholder="latest or specific version"
                      helperText="Cloud Pak for Data version"
                    />
                  </div>

                  {/* OpenShift Cluster Name Reference */}
                  <div className="global-config-section__field">
                    <TextInput
                      id="openshift_cluster_name"
                      labelText="OpenShift Cluster Reference"
                      value={config.cp4d?.[0]?.openshift_cluster_name || '{{ env_id }}'}
                      onChange={(e) => handleChange('cp4d.0.openshift_cluster_name', e.target.value)}
                      disabled={disabled}
                      placeholder="{{ env_id }}"
                      helperText="Reference to OpenShift cluster name"
                    />
                  </div>

                  {/* Production License */}
                  <div className="global-config-section__field global-config-section__field--full">
                    <Toggle
                      id="cp4d_production_license"
                      labelText="Production License"
                      labelA="No"
                      labelB="Yes"
                      toggled={config.cp4d?.[0]?.cp4d_production_license ?? true}
                      onToggle={(checked) => handleChange('cp4d.0.cp4d_production_license', checked)}
                      disabled={disabled}
                    />
                    <p className="global-config-section__toggle-help">
                      Use production license (required for production deployments)
                    </p>
                  </div>

                  {/* Accept Licenses */}
                  <div className="global-config-section__field global-config-section__field--full">
                    <Toggle
                      id="accept_licenses"
                      labelText="Accept Licenses"
                      labelA="No"
                      labelB="Yes"
                      toggled={config.cp4d?.[0]?.accept_licenses ?? false}
                      onToggle={(checked) => handleChange('cp4d.0.accept_licenses', checked)}
                      disabled={disabled}
                    />
                    <p className="global-config-section__toggle-help">
                      Accept IBM Cloud Pak for Data licenses
                    </p>
                  </div>

                  {/* DB2U Limited Privileges */}
                  <div className="global-config-section__field global-config-section__field--full">
                    <Toggle
                      id="db2u_limited_privileges"
                      labelText="DB2U Limited Privileges"
                      labelA="No"
                      labelB="Yes"
                      toggled={config.cp4d?.[0]?.db2u_limited_privileges ?? false}
                      onToggle={(checked) => handleChange('cp4d.0.db2u_limited_privileges', checked)}
                      disabled={disabled}
                    />
                    <p className="global-config-section__toggle-help">
                      Run DB2U with limited privileges (for restricted environments)
                    </p>
                  </div>

                  {/* IBM Cert Manager */}
                  <div className="global-config-section__field global-config-section__field--full">
                    <Toggle
                      id="ibm_cert_manager"
                      labelText="IBM Certificate Manager"
                      labelA="No"
                      labelB="Yes"
                      toggled={config.cp4d?.[0]?.ibm_cert_manager ?? false}
                      onToggle={(checked) => handleChange('cp4d.0.ibm_cert_manager', checked)}
                      disabled={disabled}
                    />
                    <p className="global-config-section__toggle-help">
                      Use IBM Certificate Manager instead of Red Hat cert-manager
                    </p>
                  </div>

                  {/* Install Day0 Patch */}
                  <div className="global-config-section__field global-config-section__field--full">
                    <Toggle
                      id="install_day0_patch"
                      labelText="Install Day 0 Patch"
                      labelA="No"
                      labelB="Yes"
                      toggled={config.cp4d?.[0]?.install_day0_patch ?? true}
                      onToggle={(checked) => handleChange('cp4d.0.install_day0_patch', checked)}
                      disabled={disabled}
                    />
                    <p className="global-config-section__toggle-help">
                      Install day 0 patches during deployment
                    </p>
                  </div>
                </div>
              </FormGroup>

              {/* Warning for accept_licenses */}
              {config.cp4d?.[0]?.accept_licenses === false && (
                <InlineNotification
                  kind="warning"
                  title="License Acceptance Required"
                  subtitle="You must accept the licenses before deployment can proceed."
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
