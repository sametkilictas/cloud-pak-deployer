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
  AccordionItem,
  MultiSelect
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
  // Cloud platform options (temporarily only existing-ocp is active)
  const cloudPlatforms = useMemo(() => [
    { value: 'existing-ocp', label: 'Existing OpenShift' },
    // Temporarily disabled - will be enabled in future releases
    // { value: 'aws', label: 'AWS' },
    // { value: 'azure', label: 'Azure' },
    // { value: 'ibm-cloud', label: 'IBM Cloud' },
    // { value: 'vsphere', label: 'VMware vSphere' }
  ], []);

  // CP4D Entitlement options from reference-config.yaml
  const entitlementOptions = useMemo(() => [
    'cpd-enterprise',
    'cpd-standard',
    'cognos-analytics',
    'data-product-hub',
    'datastage',
    'ikc-premium',
    'ikc-standard',
    'openpages',
    'planning-analytics',
    'product-master',
    'speech-to-text',
    'text-to-speech',
    'watson-assistant',
    'watson-discovery',
    'watsonx-ai',
    'watsonx-code-assistant-ansible',
    'watsonx-code-assistant-z',
    'watsonx-data',
    'watsonx-gov-mm',
    'watsonx-gov-rc',
    'watsonx-orchestrate'
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
              <TextInput
                id="environment_name"
                labelText="Environment Name"
                value={config.global_config?.environment_name || ''}
                onChange={(e) => handleChange('global_config.environment_name', e.target.value)}
                invalid={hasError('environment_name')}
                invalidText={getFieldError('environment_name')}
                disabled={disabled}
                placeholder="e.g., demo, production, development"
                helperText="A descriptive name for this deployment environment"
              />

              {/* Environment ID */}
              <TextInput
                id="env_id"
                labelText="Environment ID"
                value={config.global_config?.env_id || ''}
                onChange={(e) => handleChange('global_config.env_id', e.target.value)}
                invalid={hasError('env_id')}
                invalidText={getFieldError('env_id')}
                disabled={disabled}
                placeholder="e.g., cpd-demo"
                helperText="Unique identifier for this environment (lowercase, alphanumeric with hyphens)"
              />

              {/* Cloud Platform */}
              <Select
                id="cloud_platform"
                labelText="Cloud Platform"
                value={config.global_config?.cloud_platform || 'existing-ocp'}
                onChange={(e) => handleChange('global_config.cloud_platform', e.target.value)}
                invalid={hasError('cloud_platform')}
                invalidText={getFieldError('cloud_platform')}
                disabled={disabled}
                helperText="Select the target cloud platform for deployment (currently only Existing OpenShift is supported)"
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
          </FormGroup>
        </div>

        {/* Deployment Options */}
        <Accordion>
          <AccordionItem title="Deployment Options" open={true}>
            <div className="global-config-section__accordion-content">
              <FormGroup legendText="">
                <div className="global-config-section__fields">
                  {/* Optimize Deploy */}
                  <div className="global-config-section__toggle-field">
                    <div className="global-config-section__toggle-wrapper">
                      <div className="global-config-section__toggle-label">
                        <span className="global-config-section__toggle-title">Optimize Deployment</span>
                        <p className="global-config-section__toggle-help">
                          Enable deployment optimizations for faster installation
                        </p>
                      </div>
                      <Toggle
                        id="optimize_deploy"
                        labelText=""
                        labelA="Disabled"
                        labelB="Enabled"
                        toggled={config.global_config?.optimize_deploy ?? true}
                        onToggle={(checked) => handleChange('global_config.optimize_deploy', checked)}
                        disabled={disabled}
                      />
                    </div>
                  </div>

                  {/* Confirm Destroy */}
                  <div className="global-config-section__toggle-field">
                    <div className="global-config-section__toggle-wrapper">
                      <div className="global-config-section__toggle-label">
                        <span className="global-config-section__toggle-title">Confirm Before Destroy</span>
                        <p className="global-config-section__toggle-help">
                          Require confirmation before destroying resources
                        </p>
                      </div>
                      <Toggle
                        id="confirm_destroy"
                        labelText=""
                        labelA="No"
                        labelB="Yes"
                        toggled={config.global_config?.confirm_destroy ?? false}
                        onToggle={(checked) => handleChange('global_config.confirm_destroy', checked)}
                        disabled={disabled}
                      />
                    </div>
                  </div>
                </div>
              </FormGroup>

              {/* Warning for confirm_destroy */}
              {config.global_config?.confirm_destroy === false && (
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
                  <TextInput
                    id="ocp_version"
                    labelText="OCP Version"
                    value={config.openshift?.[0]?.ocp_version || 'detect'}
                    onChange={(e) => handleChange('openshift.0.ocp_version', e.target.value)}
                    disabled={disabled}
                    placeholder="detect or specific version"
                    helperText="OpenShift version (use 'detect' for auto-detection)"
                  />

                  {/* Cluster Name */}
                  <TextInput
                    id="cluster_name"
                    labelText="Cluster Name"
                    value={config.openshift?.[0]?.cluster_name || '{{ env_id }}'}
                    onChange={(e) => handleChange('openshift.0.cluster_name', e.target.value)}
                    disabled={disabled}
                    placeholder="{{ env_id }}"
                    helperText="OpenShift cluster name"
                  />

                  {/* Domain Name */}
                  <TextInput
                    id="domain_name"
                    labelText="Domain Name"
                    value={config.openshift?.[0]?.domain_name || 'example.com'}
                    onChange={(e) => handleChange('openshift.0.domain_name', e.target.value)}
                    disabled={disabled}
                    placeholder="example.com"
                    helperText="Domain name for the cluster"
                  />

                  {/* GPU Install */}
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

                  {/* OpenShift AI Install */}
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

                  {/* MCG Install */}
                  <div className="global-config-section__toggle-field">
                    <div className="global-config-section__toggle-wrapper">
                      <div className="global-config-section__toggle-label">
                        <span className="global-config-section__toggle-title">Multi-Cloud Gateway (MCG)</span>
                        <p className="global-config-section__toggle-help">
                          Enable Multi-Cloud Gateway for object storage
                        </p>
                      </div>
                      <Toggle
                        id="mcg_install"
                        labelText=""
                        labelA="Disabled"
                        labelB="Enabled"
                        toggled={config.openshift?.[0]?.mcg?.install ?? false}
                        onToggle={(checked) => handleChange('openshift.0.mcg.install', checked)}
                        disabled={disabled}
                      />
                    </div>
                  </div>

                  {/* MCG Sub-configuration (shown when MCG is enabled) */}
                  {config.openshift?.[0]?.mcg?.install && (
                    <>
                      <Select
                        id="mcg_storage_type"
                        labelText="MCG Storage Type"
                        value={config.openshift?.[0]?.mcg?.storage_type || 'storage-class'}
                        onChange={(e) => handleChange('openshift.0.mcg.storage_type', e.target.value)}
                        disabled={disabled}
                        helperText="Storage type for MCG"
                      >
                        <SelectItem value="storage-class" text="Storage Class" />
                        <SelectItem value="pv" text="Persistent Volume" />
                      </Select>

                      <TextInput
                        id="mcg_storage_class"
                        labelText="MCG Storage Class"
                        value={config.openshift?.[0]?.mcg?.storage_class || 'managed-nfs-storage'}
                        onChange={(e) => handleChange('openshift.0.mcg.storage_class', e.target.value)}
                        disabled={disabled}
                        placeholder="managed-nfs-storage"
                        helperText="Storage class name for MCG"
                      />
                    </>
                  )}

                  {/* OpenShift AI Sub-configuration (shown when not 'no') */}
                  {config.openshift?.[0]?.openshift_ai?.install !== 'no' && (
                    <Select
                      id="openshift_ai_channel"
                      labelText="OpenShift AI Channel"
                      value={config.openshift?.[0]?.openshift_ai?.channel || 'auto'}
                      onChange={(e) => handleChange('openshift.0.openshift_ai.channel', e.target.value)}
                      disabled={disabled}
                      helperText="Update channel for OpenShift AI"
                    >
                      <SelectItem value="auto" text="Auto" />
                      <SelectItem value="stable" text="Stable" />
                      <SelectItem value="fast" text="Fast" />
                    </Select>
                  )}

                  {/* OpenShift Storage Configuration */}
                  <div className="global-config-section__subsection-title">
                    OpenShift Storage
                  </div>

                  <TextInput
                    id="storage_name"
                    labelText="Storage Name"
                    value={config.openshift?.[0]?.openshift_storage?.[0]?.storage_name || 'auto-storage'}
                    onChange={(e) => handleChange('openshift.0.openshift_storage.0.storage_name', e.target.value)}
                    disabled={disabled}
                    placeholder="auto-storage"
                    helperText="Name for the storage configuration"
                  />

                  <Select
                    id="storage_type"
                    labelText="Storage Type"
                    value={config.openshift?.[0]?.openshift_storage?.[0]?.storage_type || 'auto'}
                    onChange={(e) => handleChange('openshift.0.openshift_storage.0.storage_type', e.target.value)}
                    disabled={disabled}
                    helperText="Type of storage to configure"
                  >
                    <SelectItem value="auto" text="Auto" />
                    <SelectItem value="ocs" text="OpenShift Container Storage" />
                    <SelectItem value="nfs" text="NFS" />
                    <SelectItem value="portworx" text="Portworx" />
                  </Select>
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
                  <TextInput
                    id="cp4d_project"
                    labelText="Project Name"
                    value={config.cp4d?.[0]?.project || 'cpd'}
                    onChange={(e) => handleChange('cp4d.0.project', e.target.value)}
                    disabled={disabled}
                    placeholder="cpd"
                    helperText="OpenShift project/namespace for CP4D"
                  />

                  {/* Operators Project */}
                  <TextInput
                    id="operators_project"
                    labelText="Operators Project"
                    value={config.cp4d?.[0]?.operators_project || 'cpd-operators'}
                    onChange={(e) => handleChange('cp4d.0.operators_project', e.target.value)}
                    disabled={disabled}
                    placeholder="cpd-operators"
                    helperText="Project for CP4D operators"
                  />

                  {/* CP4D Version */}
                  <TextInput
                    id="cp4d_version"
                    labelText="CP4D Version"
                    value={config.cp4d?.[0]?.cp4d_version || 'latest'}
                    onChange={(e) => handleChange('cp4d.0.cp4d_version', e.target.value)}
                    disabled={disabled}
                    placeholder="latest or specific version"
                    helperText="Cloud Pak for Data version"
                  />

                  {/* OpenShift Cluster Name Reference */}
                  <TextInput
                    id="openshift_cluster_name"
                    labelText="OpenShift Cluster Reference"
                    value={config.cp4d?.[0]?.openshift_cluster_name || '{{ env_id }}'}
                    onChange={(e) => handleChange('cp4d.0.openshift_cluster_name', e.target.value)}
                    disabled={disabled}
                    placeholder="{{ env_id }}"
                    helperText="Reference to OpenShift cluster name"
                  />

                  {/* Production License */}
                  <div className="global-config-section__toggle-field">
                    <div className="global-config-section__toggle-wrapper">
                      <div className="global-config-section__toggle-label">
                        <span className="global-config-section__toggle-title">Production License</span>
                        <p className="global-config-section__toggle-help">
                          Use production license (required for production deployments)
                        </p>
                      </div>
                      <Toggle
                        id="cp4d_production_license"
                        labelText=""
                        labelA="No"
                        labelB="Yes"
                        toggled={config.cp4d?.[0]?.cp4d_production_license ?? true}
                        onToggle={(checked) => handleChange('cp4d.0.cp4d_production_license', checked)}
                        disabled={disabled}
                      />
                    </div>
                  </div>

                  {/* Accept Licenses */}
                  <div className="global-config-section__toggle-field">
                    <div className="global-config-section__toggle-wrapper">
                      <div className="global-config-section__toggle-label">
                        <span className="global-config-section__toggle-title">Accept Licenses</span>
                        <p className="global-config-section__toggle-help">
                          Accept IBM Cloud Pak for Data licenses
                        </p>
                      </div>
                      <Toggle
                        id="accept_licenses"
                        labelText=""
                        labelA="No"
                        labelB="Yes"
                        toggled={config.cp4d?.[0]?.accept_licenses ?? false}
                        onToggle={(checked) => handleChange('cp4d.0.accept_licenses', checked)}
                        disabled={disabled}
                      />
                    </div>
                  </div>

                  {/* DB2U Limited Privileges */}
                  <div className="global-config-section__toggle-field">
                    <div className="global-config-section__toggle-wrapper">
                      <div className="global-config-section__toggle-label">
                        <span className="global-config-section__toggle-title">DB2U Limited Privileges</span>
                        <p className="global-config-section__toggle-help">
                          Run DB2U with limited privileges (for restricted environments)
                        </p>
                      </div>
                      <Toggle
                        id="db2u_limited_privileges"
                        labelText=""
                        labelA="No"
                        labelB="Yes"
                        toggled={config.cp4d?.[0]?.db2u_limited_privileges ?? false}
                        onToggle={(checked) => handleChange('cp4d.0.db2u_limited_privileges', checked)}
                        disabled={disabled}
                      />
                    </div>
                  </div>

                  {/* IBM Cert Manager */}
                  <div className="global-config-section__toggle-field">
                    <div className="global-config-section__toggle-wrapper">
                      <div className="global-config-section__toggle-label">
                        <span className="global-config-section__toggle-title">IBM Certificate Manager</span>
                        <p className="global-config-section__toggle-help">
                          Use IBM Certificate Manager instead of Red Hat cert-manager
                        </p>
                      </div>
                      <Toggle
                        id="ibm_cert_manager"
                        labelText=""
                        labelA="No"
                        labelB="Yes"
                        toggled={config.cp4d?.[0]?.ibm_cert_manager ?? false}
                        onToggle={(checked) => handleChange('cp4d.0.ibm_cert_manager', checked)}
                        disabled={disabled}
                      />
                    </div>
                  </div>

                  {/* Install Day0 Patch */}
                  <div className="global-config-section__toggle-field">
                    <div className="global-config-section__toggle-wrapper">
                      <div className="global-config-section__toggle-label">
                        <span className="global-config-section__toggle-title">Install Day 0 Patch</span>
                        <p className="global-config-section__toggle-help">
                          Install day 0 patches during deployment
                        </p>
                      </div>
                      <Toggle
                        id="install_day0_patch"
                        labelText=""
                        labelA="No"
                        labelB="Yes"
                        toggled={config.cp4d?.[0]?.install_day0_patch ?? true}
                        onToggle={(checked) => handleChange('cp4d.0.install_day0_patch', checked)}
                        disabled={disabled}
                      />
                    </div>
                  </div>

                  {/* CP4D Entitlement */}
                  <div className="global-config-section__multiselect-field">
                    <MultiSelect
                      id="cp4d_entitlement"
                      titleText="CP4D Entitlements"
                      label="Select entitlements"
                      items={entitlementOptions.map(opt => ({ id: opt, label: opt }))}
                      itemToString={(item) => item?.label || ''}
                      initialSelectedItems={(config.cp4d?.[0]?.cp4d_entitlement || ['cpd-enterprise']).map((e: string) => ({ id: e, label: e }))}
                      onChange={(e: any) => {
                        const selected = (e.selectedItems || []).map((item: any) => item.id);
                        handleChange('cp4d.0.cp4d_entitlement', selected);
                      }}
                      disabled={disabled}
                    />
                    <p className="global-config-section__field-help">
                      Select one or more entitlements for your deployment (from reference-config.yaml)
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
