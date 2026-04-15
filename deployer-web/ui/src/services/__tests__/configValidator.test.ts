/**
 * Config Validator Tests
 * Tests for config.yaml validation against reference-config.yaml structure
 */

import { describe, it, expect } from 'vitest';
import {
  validateCartridgeNames,
  validateCartridgeStates,
  validateFoundationCartridges,
  validateGlobalConfig,
  validateOpenShiftConfig,
  validateCP4DConfig,
  validateNoDuplicateCartridges,
  validateConfig,
  validateComponentOriginalNames,
  formatValidationErrors,
  type ValidationError,
  type ValidationResult,
} from '../configValidator';
import { VALID_CARTRIDGE_NAMES, type CartridgeConfig, type ConfigYAML } from '../configGenerator';

describe('configValidator', () => {
  describe('validateCartridgeNames', () => {
    it('should return empty array for valid cartridge names', () => {
      const cartridges: CartridgeConfig[] = [
        { name: 'cp-foundation', state: 'installed' },
        { name: 'lite', state: 'installed' },
        { name: 'wml', state: 'installed' },
        { name: 'ws', state: 'installed' },
      ];

      const errors = validateCartridgeNames(cartridges);

      expect(errors).toHaveLength(0);
    });

    it('should detect invalid cartridge names', () => {
      const cartridges: CartridgeConfig[] = [
        { name: 'cp-foundation', state: 'installed' },
        { name: 'watson-ml', state: 'installed' }, // Invalid - should be 'wml'
        { name: 'invalid-component', state: 'installed' },
      ];

      const errors = validateCartridgeNames(cartridges);

      expect(errors).toHaveLength(2);
      expect(errors[0].field).toContain('watson-ml');
      expect(errors[0].severity).toBe('error');
      expect(errors[1].field).toContain('invalid-component');
    });

    it('should handle empty cartridge list', () => {
      const errors = validateCartridgeNames([]);

      expect(errors).toHaveLength(0);
    });
  });

  describe('validateCartridgeStates', () => {
    it('should accept valid states', () => {
      const cartridges: CartridgeConfig[] = [
        { name: 'wml', state: 'installed' },
        { name: 'ws', state: 'removed' },
      ];

      const errors = validateCartridgeStates(cartridges);

      expect(errors).toHaveLength(0);
    });

    it('should detect invalid states', () => {
      const cartridges: CartridgeConfig[] = [
        { name: 'wml', state: 'active' as any },
        { name: 'ws', state: 'pending' as any },
      ];

      const errors = validateCartridgeStates(cartridges);

      expect(errors).toHaveLength(2);
      expect(errors[0].message).toContain('Invalid state');
      expect(errors[0].severity).toBe('error');
    });

    it('should handle cartridges without state field', () => {
      const cartridges: CartridgeConfig[] = [
        { name: 'wml' } as any,
      ];

      const errors = validateCartridgeStates(cartridges);

      expect(errors).toHaveLength(0);
    });
  });

  describe('validateFoundationCartridges', () => {
    it('should pass when foundation cartridges are present', () => {
      const cartridges: CartridgeConfig[] = [
        { name: 'cp-foundation', state: 'installed' },
        { name: 'lite', state: 'installed' },
        { name: 'wml', state: 'installed' },
      ];

      const errors = validateFoundationCartridges(cartridges);

      expect(errors).toHaveLength(0);
    });

    it('should detect missing cp-foundation', () => {
      const cartridges: CartridgeConfig[] = [
        { name: 'lite', state: 'installed' },
        { name: 'wml', state: 'installed' },
      ];

      const errors = validateFoundationCartridges(cartridges);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('cp-foundation');
      expect(errors[0].severity).toBe('error');
    });

    it('should detect missing lite', () => {
      const cartridges: CartridgeConfig[] = [
        { name: 'cp-foundation', state: 'installed' },
        { name: 'wml', state: 'installed' },
      ];

      const errors = validateFoundationCartridges(cartridges);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('lite');
    });

    it('should detect both missing foundation cartridges', () => {
      const cartridges: CartridgeConfig[] = [
        { name: 'wml', state: 'installed' },
      ];

      const errors = validateFoundationCartridges(cartridges);

      expect(errors).toHaveLength(2);
    });
  });

  describe('validateGlobalConfig', () => {
    it('should pass for valid global config', () => {
      const config: ConfigYAML = {
        global_config: {
          environment_name: 'demo',
          cloud_platform: 'existing-ocp',
          confirm_destroy: false,
          optimize_deploy: true,
          env_id: 'cpd-demo',
        },
        openshift: [],
        cp4d: [],
      };

      const errors = validateGlobalConfig(config);

      expect(errors).toHaveLength(0);
    });

    it('should detect missing global_config section', () => {
      const config: any = {
        openshift: [],
        cp4d: [],
      };

      const errors = validateGlobalConfig(config);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('global_config');
    });

    it('should detect missing required fields', () => {
      const config: ConfigYAML = {
        global_config: {
          environment_name: 'demo',
          // Missing cloud_platform and env_id
        } as any,
        openshift: [],
        cp4d: [],
      };

      const errors = validateGlobalConfig(config);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.message.includes('cloud_platform'))).toBe(true);
      expect(errors.some(e => e.message.includes('env_id'))).toBe(true);
    });
  });

  describe('validateOpenShiftConfig', () => {
    it('should pass for valid openshift config', () => {
      const config: ConfigYAML = {
        global_config: {} as any,
        openshift: [
          {
            name: '{{ env_id }}',
            ocp_version: 'detect',
            cluster_name: '{{ env_id }}',
            domain_name: 'example.com',
          },
        ],
        cp4d: [],
      };

      const errors = validateOpenShiftConfig(config);

      expect(errors).toHaveLength(0);
    });

    it('should detect missing openshift section', () => {
      const config: any = {
        global_config: {},
        cp4d: [],
      };

      const errors = validateOpenShiftConfig(config);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('openshift');
    });

    it('should detect empty openshift array', () => {
      const config: ConfigYAML = {
        global_config: {} as any,
        openshift: [],
        cp4d: [],
      };

      const errors = validateOpenShiftConfig(config);

      expect(errors).toHaveLength(1);
    });

    it('should detect missing required fields', () => {
      const config: ConfigYAML = {
        global_config: {} as any,
        openshift: [
          {
            name: '{{ env_id }}',
            // Missing ocp_version, cluster_name, domain_name
          } as any,
        ],
        cp4d: [],
      };

      const errors = validateOpenShiftConfig(config);

      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateCP4DConfig', () => {
    it('should pass for valid cp4d config', () => {
      const config: ConfigYAML = {
        global_config: {} as any,
        openshift: [],
        cp4d: [
          {
            project: 'cpd',
            openshift_cluster_name: '{{ env_id }}',
            cp4d_version: 'latest',
            state: 'installed',
            cartridges: [],
          },
        ],
      };

      const errors = validateCP4DConfig(config);

      expect(errors).toHaveLength(0);
    });

    it('should detect missing cp4d section', () => {
      const config: any = {
        global_config: {},
        openshift: [],
      };

      const errors = validateCP4DConfig(config);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('cp4d');
    });

    it('should detect empty cp4d array', () => {
      const config: ConfigYAML = {
        global_config: {} as any,
        openshift: [],
        cp4d: [],
      };

      const errors = validateCP4DConfig(config);

      expect(errors).toHaveLength(1);
    });

    it('should detect missing required fields', () => {
      const config: ConfigYAML = {
        global_config: {} as any,
        openshift: [],
        cp4d: [
          {
            project: 'cpd',
            // Missing other required fields
          } as any,
        ],
      };

      const errors = validateCP4DConfig(config);

      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateNoDuplicateCartridges', () => {
    it('should pass when no duplicates exist', () => {
      const cartridges: CartridgeConfig[] = [
        { name: 'cp-foundation', state: 'installed' },
        { name: 'lite', state: 'installed' },
        { name: 'wml', state: 'installed' },
        { name: 'ws', state: 'installed' },
      ];

      const errors = validateNoDuplicateCartridges(cartridges);

      expect(errors).toHaveLength(0);
    });

    it('should detect duplicate cartridges', () => {
      const cartridges: CartridgeConfig[] = [
        { name: 'wml', state: 'installed' },
        { name: 'ws', state: 'installed' },
        { name: 'wml', state: 'installed' }, // Duplicate
      ];

      const errors = validateNoDuplicateCartridges(cartridges);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('Duplicate');
      expect(errors[0].message).toContain('wml');
    });

    it('should detect multiple duplicates', () => {
      const cartridges: CartridgeConfig[] = [
        { name: 'wml', state: 'installed' },
        { name: 'wml', state: 'installed' },
        { name: 'ws', state: 'installed' },
        { name: 'ws', state: 'installed' },
      ];

      const errors = validateNoDuplicateCartridges(cartridges);

      expect(errors).toHaveLength(2);
    });
  });

  describe('validateConfig', () => {
    it('should pass for completely valid config', () => {
      const config: ConfigYAML = {
        global_config: {
          environment_name: 'demo',
          cloud_platform: 'existing-ocp',
          confirm_destroy: false,
          optimize_deploy: true,
          env_id: 'cpd-demo',
        },
        openshift: [
          {
            name: '{{ env_id }}',
            ocp_version: 'detect',
            cluster_name: '{{ env_id }}',
            domain_name: 'example.com',
          },
        ],
        cp4d: [
          {
            project: 'cpd',
            openshift_cluster_name: '{{ env_id }}',
            cp4d_version: 'latest',
            state: 'installed',
            cartridges: [
              { name: 'cp-foundation', state: 'installed' },
              { name: 'lite', state: 'installed' },
              { name: 'wml', state: 'installed' },
            ],
          },
        ],
      };

      const result = validateConfig(config);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect multiple validation errors', () => {
      const config: ConfigYAML = {
        global_config: {
          environment_name: 'demo',
          // Missing required fields
        } as any,
        openshift: [],
        cp4d: [
          {
            project: 'cpd',
            openshift_cluster_name: '{{ env_id }}',
            cp4d_version: 'latest',
            state: 'installed',
            cartridges: [
              { name: 'invalid-cartridge', state: 'installed' },
              { name: 'wml', state: 'installed' },
              { name: 'wml', state: 'installed' }, // Duplicate
              // Missing foundation cartridges
            ],
          },
        ],
      };

      const result = validateConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should separate errors and warnings', () => {
      const config: ConfigYAML = {
        global_config: {
          environment_name: 'demo',
          cloud_platform: 'existing-ocp',
          confirm_destroy: false,
          optimize_deploy: true,
          env_id: 'cpd-demo',
        },
        openshift: [
          {
            name: '{{ env_id }}',
            ocp_version: 'detect',
            cluster_name: '{{ env_id }}',
            domain_name: 'example.com',
          },
        ],
        cp4d: [
          {
            project: 'cpd',
            openshift_cluster_name: '{{ env_id }}',
            cp4d_version: 'latest',
            state: 'installed',
            cartridges: [
              { name: 'wml', state: 'installed' },
              // Missing foundation cartridges (errors)
            ],
          },
        ],
      };

      const result = validateConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.every(e => e.severity === 'error')).toBe(true);
    });
  });

  describe('validateComponentOriginalNames', () => {
    it('should pass for valid originalNames', () => {
      const components = [
        { id: 'watson-ml', originalName: 'wml' },
        { id: 'watson-studio', originalName: 'ws' },
        { id: 'db2-oltp', originalName: 'db2' },
      ];

      const errors = validateComponentOriginalNames(components);

      expect(errors).toHaveLength(0);
    });

    it('should detect invalid originalNames', () => {
      const components = [
        { id: 'watson-ml', originalName: 'watson-ml' }, // Invalid
        { id: 'watson-studio', originalName: 'watson-studio' }, // Invalid
        { id: 'db2-oltp', originalName: 'db2' }, // Valid
      ];

      const errors = validateComponentOriginalNames(components);

      expect(errors).toHaveLength(2);
      expect(errors[0].message).toContain('watson-ml');
      expect(errors[1].message).toContain('watson-studio');
    });
  });

  describe('formatValidationErrors', () => {
    it('should format errors correctly', () => {
      const result: ValidationResult = {
        valid: false,
        errors: [
          { field: 'cartridges.wml', message: 'Invalid cartridge', severity: 'error' },
          { field: 'global_config.env_id', message: 'Missing field', severity: 'error' },
        ],
        warnings: [],
      };

      const formatted = formatValidationErrors(result);

      expect(formatted).toContain('Errors:');
      expect(formatted).toContain('cartridges.wml');
      expect(formatted).toContain('Invalid cartridge');
      expect(formatted).toContain('global_config.env_id');
      expect(formatted).toContain('Missing field');
    });

    it('should format warnings correctly', () => {
      const result: ValidationResult = {
        valid: true,
        errors: [],
        warnings: [
          { field: 'cartridges', message: 'Consider adding more components', severity: 'warning' },
        ],
      };

      const formatted = formatValidationErrors(result);

      expect(formatted).toContain('Warnings:');
      expect(formatted).toContain('Consider adding more components');
    });

    it('should format both errors and warnings', () => {
      const result: ValidationResult = {
        valid: false,
        errors: [
          { field: 'field1', message: 'Error message', severity: 'error' },
        ],
        warnings: [
          { field: 'field2', message: 'Warning message', severity: 'warning' },
        ],
      };

      const formatted = formatValidationErrors(result);

      expect(formatted).toContain('Errors:');
      expect(formatted).toContain('Error message');
      expect(formatted).toContain('Warnings:');
      expect(formatted).toContain('Warning message');
    });

    it('should handle empty result', () => {
      const result: ValidationResult = {
        valid: true,
        errors: [],
        warnings: [],
      };

      const formatted = formatValidationErrors(result);

      expect(formatted).toBe('');
    });
  });
});

// Made with Bob