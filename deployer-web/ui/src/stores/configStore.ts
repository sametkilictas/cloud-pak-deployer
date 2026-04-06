/**
 * Configuration Store
 * Manages Cloud Pak configuration state and YAML generation
 */

import { create } from 'zustand';
import { CloudPakConfig, GlobalConfig, CartridgeConfig, SavedConfiguration } from '@/types';
import yaml from 'js-yaml';

interface ConfigStore {
  // State
  configuration: CloudPakConfig | null;
  isDirty: boolean;
  validationErrors: Record<string, string[]>;
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeConfig: () => void;
  updateGlobalConfig: (config: Partial<GlobalConfig>) => void;
  updateComponentConfig: (componentId: string, config: Partial<CartridgeConfig>) => void;
  generateYAML: () => string;
  validateConfiguration: () => boolean;
  saveConfiguration: (name: string, description?: string) => void;
  loadConfiguration: (name: string) => void;
  getSavedConfigurations: () => SavedConfiguration[];
  exportConfiguration: () => void;
  importConfiguration: (yamlString: string) => void;
  resetConfiguration: () => void;
  setComponentState: (componentId: string, state: 'installed' | 'removed') => void;
}

// Reference configuration template
const REFERENCE_CONFIG: CloudPakConfig = {
  global_config: {
    environment_name: 'demo',
    cloud_platform: 'existing-ocp',
    confirm_destroy: false,
    optimize_deploy: true,
    env_id: 'cpd-demo'
  },
  openshift: [
    {
      name: '{{ env_id }}',
      ocp_version: 'detect',
      cluster_name: '{{ env_id }}',
      domain_name: 'example.com',
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
      ]
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
      state: 'installed',
      cartridges: []
    }
  ]
};

export const useConfigStore = create<ConfigStore>((set, get) => ({
  // Initial State
  configuration: null,
  isDirty: false,
  validationErrors: {},
  isLoading: false,
  error: null,

  // Initialize configuration with reference template
  initializeConfig: () => {
    const config = JSON.parse(JSON.stringify(REFERENCE_CONFIG));
    set({
      configuration: config,
      isDirty: false,
      validationErrors: {},
      error: null
    });
  },

  // Update global configuration
  updateGlobalConfig: (config: Partial<GlobalConfig>) => {
    set(state => {
      if (!state.configuration) return state;

      return {
        configuration: {
          ...state.configuration,
          global_config: {
            ...state.configuration.global_config,
            ...config
          }
        },
        isDirty: true
      };
    });
  },

  // Update component-specific configuration
  updateComponentConfig: (componentId: string, config: Partial<CartridgeConfig>) => {
    set(state => {
      if (!state.configuration) return state;

      const cartridges = state.configuration.cp4d[0].cartridges.map(c =>
        c.name === componentId ? { ...c, ...config } : c
      );

      return {
        configuration: {
          ...state.configuration,
          cp4d: [
            {
              ...state.configuration.cp4d[0],
              cartridges
            }
          ]
        },
        isDirty: true
      };
    });
  },

  // Set component state (installed/removed)
  setComponentState: (componentId: string, state: 'installed' | 'removed') => {
    get().updateComponentConfig(componentId, { state });
  },

  // Generate YAML string from configuration
  generateYAML: () => {
    const { configuration } = get();
    if (!configuration) return '';

    try {
      return yaml.dump(configuration, {
        indent: 2,
        lineWidth: -1,
        noRefs: true
      });
    } catch (error) {
      console.error('Failed to generate YAML:', error);
      return '';
    }
  },

  // Validate configuration
  validateConfiguration: () => {
    const { configuration } = get();
    if (!configuration) return false;

    const errors: Record<string, string[]> = {};

    // Validate global config
    if (!configuration.global_config.env_id) {
      errors.global = errors.global || [];
      errors.global.push('Environment ID is required');
    }

    // Validate CP4D config
    if (!configuration.cp4d || configuration.cp4d.length === 0) {
      errors.cp4d = errors.cp4d || [];
      errors.cp4d.push('At least one CP4D configuration is required');
    }

    // Validate entitlements
    if (
      !configuration.cp4d[0].cp4d_entitlement ||
      configuration.cp4d[0].cp4d_entitlement.length === 0
    ) {
      errors.entitlement = errors.entitlement || [];
      errors.entitlement.push('At least one entitlement is required');
    }

    set({ validationErrors: errors });
    return Object.keys(errors).length === 0;
  },

  // Save configuration to localStorage
  saveConfiguration: (name: string, description?: string) => {
    const { configuration } = get();
    if (!configuration) return;

    try {
      const saved = JSON.parse(localStorage.getItem('saved_configs') || '{}');
      const savedConfig: SavedConfiguration = {
        name,
        config: configuration,
        timestamp: new Date().toISOString(),
        description
      };

      saved[name] = savedConfig;
      localStorage.setItem('saved_configs', JSON.stringify(saved));

      set({ isDirty: false });
    } catch (error) {
      set({ error: 'Failed to save configuration' });
    }
  },

  // Load configuration from localStorage
  loadConfiguration: (name: string) => {
    try {
      const saved = JSON.parse(localStorage.getItem('saved_configs') || '{}');
      const savedConfig = saved[name] as SavedConfiguration;

      if (savedConfig) {
        set({
          configuration: savedConfig.config,
          isDirty: false,
          error: null
        });
      } else {
        set({ error: 'Configuration not found' });
      }
    } catch (error) {
      set({ error: 'Failed to load configuration' });
    }
  },

  // Get list of saved configurations
  getSavedConfigurations: () => {
    try {
      const saved = JSON.parse(localStorage.getItem('saved_configs') || '{}');
      return Object.values(saved) as SavedConfiguration[];
    } catch (error) {
      return [];
    }
  },

  // Export configuration as YAML file
  exportConfiguration: () => {
    const yamlString = get().generateYAML();
    if (!yamlString) return;

    const blob = new Blob([yamlString], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `config-${Date.now()}.yaml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Import configuration from YAML string
  importConfiguration: (yamlString: string) => {
    try {
      const config = yaml.load(yamlString) as CloudPakConfig;

      // Basic validation
      if (!config.global_config || !config.cp4d) {
        throw new Error('Invalid configuration format');
      }

      set({
        configuration: config,
        isDirty: false,
        error: null
      });
    } catch (error) {
      set({ error: 'Failed to import configuration: ' + (error as Error).message });
    }
  },

  // Reset configuration to reference template
  resetConfiguration: () => {
    get().initializeConfig();
  }
}));

// Made with Bob
