/**
 * Config Generator Service
 * Generates valid config.yaml for cloud-pak-deployer backend
 * Uses component.originalName to ensure correct cartridge names
 * Merges user configuration with defaults from reference-config.yaml
 */

import { Component } from '@/types';
import { mergeWithDefaults } from './referenceConfigDefaults';

export interface CartridgeConfig {
  name: string;
  description?: string;
  state: 'installed' | 'removed';
  size?: string;
  [key: string]: any;
}

export interface CP4DConfig {
  project: string;
  openshift_cluster_name: string;
  cp4d_version: string;
  cp4d_entitlement?: string[];
  cp4d_production_license?: boolean;
  accept_licenses?: boolean;
  db2u_limited_privileges?: boolean;
  operators_project?: string;
  ibm_cert_manager?: boolean;
  install_day0_patch?: boolean;
  state: 'installed' | 'removed';
  cartridges: CartridgeConfig[];
}

export interface GlobalConfig {
  environment_name: string;
  cloud_platform: string;
  confirm_destroy: boolean;
  optimize_deploy?: boolean;
  env_id: string;
}

export interface OpenShiftConfig {
  name: string;
  ocp_version: string;
  cluster_name: string;
  domain_name: string;
  [key: string]: any;
}

export interface ConfigYAML {
  global_config: GlobalConfig;
  openshift: OpenShiftConfig[];
  cp4d: CP4DConfig[];
}

/**
 * Generate cartridge configuration from selected components
 * CRITICAL: Uses component.originalName for cartridge name (not component.id)
 */
export function generateCartridges(
  selectedComponents: Component[],
  componentConfigs: Record<string, any>
): CartridgeConfig[] {
  const cartridges: CartridgeConfig[] = [];

  // Always include foundation cartridges
  cartridges.push({
    name: 'cp-foundation',
    state: 'installed',
    scale: 'level_1',
    license_service: {
      threads_per_core: 2
    }
  });

  cartridges.push({
    name: 'lite',
    state: 'installed'
  });

  // Add selected components using originalName
  for (const component of selectedComponents) {
    // Skip disabled components
    if (component.disabled) {
      continue;
    }

    // Skip foundation components (already added above)
    if (component.originalName === 'cp-foundation' || component.originalName === 'lite') {
      continue;
    }

    // Get user configuration (if any)
    const userConfig = componentConfigs[component.originalName] || {};
    
    // Merge with reference defaults - defaults provide base, user config overrides
    const mergedConfig = mergeWithDefaults(component.originalName, userConfig);
    
    const cartridge: CartridgeConfig = {
      name: component.originalName, // ← CRITICAL: Use originalName, not id
      description: component.description,
      state: userConfig.state || 'installed',
      ...mergedConfig
    };

    // Remove undefined values
    Object.keys(cartridge).forEach(key => {
      if (cartridge[key] === undefined) {
        delete cartridge[key];
      }
    });

    // Remove empty installation_options object
    if (cartridge.installation_options &&
        typeof cartridge.installation_options === 'object' &&
        Object.keys(cartridge.installation_options).length === 0) {
      delete cartridge.installation_options;
    }

    cartridges.push(cartridge);
  }

  return cartridges;
}

/**
 * Generate complete config.yaml structure
 */
export function generateConfigYAML(
  selectedComponents: Component[],
  componentConfigs: Record<string, any>,
  globalConfig?: Partial<GlobalConfig>,
  openshiftConfig?: Partial<OpenShiftConfig>
): ConfigYAML {
  const cartridges = generateCartridges(selectedComponents, componentConfigs);

  const config: ConfigYAML = {
    global_config: {
      environment_name: globalConfig?.environment_name || 'demo',
      cloud_platform: globalConfig?.cloud_platform || 'existing-ocp',
      confirm_destroy: globalConfig?.confirm_destroy ?? false,
      optimize_deploy: globalConfig?.optimize_deploy ?? true,
      env_id: globalConfig?.env_id || 'cpd-demo',
      ...globalConfig
    },
    openshift: [
      {
        name: openshiftConfig?.name || '{{ env_id }}',
        ocp_version: openshiftConfig?.ocp_version || 'detect',
        cluster_name: openshiftConfig?.cluster_name || '{{ env_id }}',
        domain_name: openshiftConfig?.domain_name || 'example.com',
        mcg: {
          install: false,
          storage_type: 'storage-class',
          storage_class: 'managed-nfs-storage'
        },
        gpu: {
          install: 'auto'
        },
        openshift_ai: {
          install: 'auto',
          channel: 'auto'
        },
        openshift_storage: [
          {
            storage_name: 'auto-storage',
            storage_type: 'auto'
          }
        ],
        ...openshiftConfig
      }
    ],
    cp4d: [
      {
        project: 'cpd',
        openshift_cluster_name: '{{ env_id }}',
        cp4d_version: 'latest',
        cp4d_entitlement: ['cpd-enterprise'],
        cp4d_production_license: true,
        accept_licenses: false,
        db2u_limited_privileges: false,
        operators_project: 'cpd-operators',
        ibm_cert_manager: false,
        install_day0_patch: true,
        state: 'installed',
        cartridges
      }
    ]
  };

  return config;
}

/**
 * Convert config object to YAML string
 * Note: In production, use a proper YAML library like js-yaml
 */
export function configToYAML(config: ConfigYAML): string {
  // This is a simplified YAML generator
  // In production, use js-yaml library for proper YAML generation
  return JSON.stringify(config, null, 2)
    .replace(/"([^"]+)":/g, '$1:') // Remove quotes from keys
    .replace(/"/g, '') // Remove quotes from values (simplified)
    .replace(/,$/gm, ''); // Remove trailing commas
}

/**
 * Validate cartridge names against reference config
 * Returns list of invalid cartridge names
 */
export function validateCartridgeNames(
  cartridges: CartridgeConfig[],
  validNames: string[]
): string[] {
  const invalidNames: string[] = [];
  
  for (const cartridge of cartridges) {
    if (!validNames.includes(cartridge.name)) {
      invalidNames.push(cartridge.name);
    }
  }
  
  return invalidNames;
}

/**
 * Get list of valid cartridge names from reference config
 * This should be loaded from reference-config.yaml
 */
export const VALID_CARTRIDGE_NAMES = [
  'cp-foundation',
  'lite',
  'scheduler',
  'analyticsengine',
  'bigsql',
  'ca',
  'dashboard',
  'datagate',
  'datalineage',
  'dataproduct',
  'datastage-ent',
  'datastage-ent-plus',
  'db2',
  'db2wh',
  'dmc',
  'dods',
  'dp',
  'dpra',
  'dv',
  'edb_cp4d',
  'factsheet',
  'hee',
  'mantaflow',
  'match360',
  'mongodb',
  'openpages',
  'planning-analytics',
  'replication',
  'rstudio',
  'spss',
  'streamsets',
  'syntheticdata',
  'udp',
  'voice-gateway',
  'watson-assistant',
  'watson-discovery',
  'watson-openscale',
  'watson-speech',
  'watsonx_ai',
  'watsonx_data',
  'watsonx_dataintegration',
  'watsonx_dataintelligence',
  'watsonx_data_premium',
  'watsonx_governance',
  'watsonx_orchestrate',
  'wca',
  'wca-ansible',
  'wca-z',
  'wca-z-ce',
  'wkc',
  'ikc_premium',
  'ikc_standard',
  'wml',
  'wml-accelerator',
  'ws',
  'ws-pipelines',
  'ws-runtimes',
  'productmaster'
];

// Made with Bob