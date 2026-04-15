/**
 * Config Generator Tests
 * Tests for config.yaml generation and cartridge name validation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateCartridges,
  generateConfigYAML,
  validateCartridgeNames,
  VALID_CARTRIDGE_NAMES,
  type CartridgeConfig,
} from '../configGenerator';
import { Component } from '../../types';

describe('configGenerator', () => {
  describe('VALID_CARTRIDGE_NAMES', () => {
    it('should contain all required foundation cartridges', () => {
      expect(VALID_CARTRIDGE_NAMES).toContain('cp-foundation');
      expect(VALID_CARTRIDGE_NAMES).toContain('lite');
    });

    it('should contain expected number of cartridges', () => {
      // Reference config has 51 cartridges
      expect(VALID_CARTRIDGE_NAMES.length).toBeGreaterThanOrEqual(51);
    });

    it('should contain common cartridges', () => {
      const commonCartridges = [
        'wml',
        'ws',
        'ws-runtimes',
        'wml-accelerator',
        'watson-assistant',
        'watson-discovery',
        'watson-speech',
        'watsonx_ai',
        'watsonx_data',
        'db2',
        'ca',
      ];

      commonCartridges.forEach(cartridge => {
        expect(VALID_CARTRIDGE_NAMES).toContain(cartridge);
      });
    });
  });

  describe('generateCartridges', () => {
    let mockComponents: Component[];
    let mockComponentConfigs: Record<string, any>;

    beforeEach(() => {
      mockComponents = [
        {
          id: 'watson-ml',
          name: 'Watson Machine Learning',
          originalName: 'wml',
          description: 'Machine learning platform',
          category: 'AI & Machine Learning',
          state: 'installed',
          restrictions: [],
          externalDependencies: [],
          serviceDependencies: [],
          componentDependencies: [],
          configSchema: { fields: [] },
        },
        {
          id: 'watson-studio',
          name: 'Watson Studio',
          originalName: 'ws',
          description: 'Data science platform',
          category: 'AI & Machine Learning',
          state: 'installed',
          restrictions: [],
          externalDependencies: [],
          serviceDependencies: [],
          componentDependencies: [],
          configSchema: { fields: [] },
        },
      ];

      mockComponentConfigs = {
        'watson-ml': {
          size: 'small',
          state: 'installed',
        },
        'watson-studio': {
          size: 'medium',
          state: 'installed',
        },
      };
    });

    it('should always include foundation cartridges', () => {
      const cartridges = generateCartridges([], {});

      expect(cartridges).toHaveLength(2);
      expect(cartridges[0].name).toBe('cp-foundation');
      expect(cartridges[1].name).toBe('lite');
    });

    it('should use originalName for cartridge names', () => {
      const cartridges = generateCartridges(mockComponents, mockComponentConfigs);

      // Foundation + 2 components = 4 total
      expect(cartridges).toHaveLength(4);
      
      // Check that originalName is used, not id
      const componentCartridges = cartridges.slice(2);
      expect(componentCartridges[0].name).toBe('wml'); // Not 'watson-ml'
      expect(componentCartridges[1].name).toBe('ws'); // Not 'watson-studio'
    });

    it('should skip disabled components', () => {
      const disabledComponent: Component = {
        ...mockComponents[0],
        disabled: true,
        disabledReason: 'Not available',
      };

      const cartridges = generateCartridges([disabledComponent], mockComponentConfigs);

      // Should only have foundation cartridges
      expect(cartridges).toHaveLength(2);
      expect(cartridges.every(c => ['cp-foundation', 'lite'].includes(c.name))).toBe(true);
    });

    it('should merge component configs correctly', () => {
      const cartridges = generateCartridges(mockComponents, mockComponentConfigs);

      const wmlCartridge = cartridges.find(c => c.name === 'wml');
      expect(wmlCartridge).toBeDefined();
      expect(wmlCartridge?.size).toBe('small');
      expect(wmlCartridge?.state).toBe('installed');
    });

    it('should use default state if not provided', () => {
      const cartridges = generateCartridges(mockComponents, {});

      const wmlCartridge = cartridges.find(c => c.name === 'wml');
      expect(wmlCartridge?.state).toBe('installed');
    });

    it('should include component description', () => {
      const cartridges = generateCartridges(mockComponents, {});

      const wmlCartridge = cartridges.find(c => c.name === 'wml');
      expect(wmlCartridge?.description).toBe('Machine learning platform');
    });

    it('should remove undefined values', () => {
      const componentWithUndefined: Component = {
        ...mockComponents[0],
        description: undefined as any,
      };

      const cartridges = generateCartridges([componentWithUndefined], {});

      const wmlCartridge = cartridges.find(c => c.name === 'wml');
      expect(wmlCartridge).toBeDefined();
      expect('description' in wmlCartridge!).toBe(false);
    });
  });

  describe('generateConfigYAML', () => {
    let mockComponents: Component[];

    beforeEach(() => {
      mockComponents = [
        {
          id: 'watson-ml',
          name: 'Watson Machine Learning',
          originalName: 'wml',
          description: 'Machine learning platform',
          category: 'AI & Machine Learning',
          state: 'installed',
          restrictions: [],
          externalDependencies: [],
          serviceDependencies: [],
          componentDependencies: [],
          configSchema: { fields: [] },
        },
      ];
    });

    it('should generate complete config structure', () => {
      const config = generateConfigYAML(mockComponents, {});

      expect(config).toHaveProperty('global_config');
      expect(config).toHaveProperty('openshift');
      expect(config).toHaveProperty('cp4d');
    });

    it('should use default global config values', () => {
      const config = generateConfigYAML(mockComponents, {});

      expect(config.global_config.environment_name).toBe('demo');
      expect(config.global_config.cloud_platform).toBe('existing-ocp');
      expect(config.global_config.env_id).toBe('cpd-demo');
      expect(config.global_config.confirm_destroy).toBe(false);
      expect(config.global_config.optimize_deploy).toBe(true);
    });

    it('should merge custom global config', () => {
      const customGlobal = {
        environment_name: 'production',
        env_id: 'prod-cluster',
      };

      const config = generateConfigYAML(mockComponents, {}, customGlobal);

      expect(config.global_config.environment_name).toBe('production');
      expect(config.global_config.env_id).toBe('prod-cluster');
      expect(config.global_config.cloud_platform).toBe('existing-ocp'); // Default preserved
    });

    it('should generate openshift config with defaults', () => {
      const config = generateConfigYAML(mockComponents, {});

      expect(config.openshift).toHaveLength(1);
      expect(config.openshift[0].name).toBe('{{ env_id }}');
      expect(config.openshift[0].ocp_version).toBe('detect');
      expect(config.openshift[0].domain_name).toBe('example.com');
    });

    it('should generate cp4d config with cartridges', () => {
      const config = generateConfigYAML(mockComponents, {});

      expect(config.cp4d).toHaveLength(1);
      expect(config.cp4d[0].project).toBe('cpd');
      expect(config.cp4d[0].cp4d_version).toBe('latest');
      expect(config.cp4d[0].state).toBe('installed');
      expect(config.cp4d[0].cartridges).toBeDefined();
      expect(config.cp4d[0].cartridges.length).toBeGreaterThan(0);
    });

    it('should include foundation cartridges in cp4d config', () => {
      const config = generateConfigYAML(mockComponents, {});

      const cartridgeNames = config.cp4d[0].cartridges.map(c => c.name);
      expect(cartridgeNames).toContain('cp-foundation');
      expect(cartridgeNames).toContain('lite');
    });

    it('should use originalName for component cartridges', () => {
      const config = generateConfigYAML(mockComponents, {});

      const cartridgeNames = config.cp4d[0].cartridges.map(c => c.name);
      expect(cartridgeNames).toContain('wml'); // originalName
      expect(cartridgeNames).not.toContain('watson-ml'); // Not UI id
    });
  });

  describe('validateCartridgeNames', () => {
    it('should return empty array for valid cartridge names', () => {
      const validCartridges: CartridgeConfig[] = [
        { name: 'cp-foundation', state: 'installed' },
        { name: 'lite', state: 'installed' },
        { name: 'wml', state: 'installed' },
        { name: 'ws', state: 'installed' },
      ];

      const invalid = validateCartridgeNames(validCartridges, VALID_CARTRIDGE_NAMES);

      expect(invalid).toHaveLength(0);
    });

    it('should return invalid cartridge names', () => {
      const cartridges: CartridgeConfig[] = [
        { name: 'cp-foundation', state: 'installed' },
        { name: 'watson-ml', state: 'installed' }, // Invalid - should be 'wml'
        { name: 'watson-studio', state: 'installed' }, // Invalid - should be 'ws'
        { name: 'invalid-component', state: 'installed' }, // Invalid
      ];

      const invalid = validateCartridgeNames(cartridges, VALID_CARTRIDGE_NAMES);

      expect(invalid).toHaveLength(3);
      expect(invalid).toContain('watson-ml');
      expect(invalid).toContain('watson-studio');
      expect(invalid).toContain('invalid-component');
    });

    it('should handle empty cartridge list', () => {
      const invalid = validateCartridgeNames([], VALID_CARTRIDGE_NAMES);

      expect(invalid).toHaveLength(0);
    });

    it('should validate against custom valid names list', () => {
      const customValidNames = ['component-a', 'component-b'];
      const cartridges: CartridgeConfig[] = [
        { name: 'component-a', state: 'installed' },
        { name: 'component-c', state: 'installed' },
      ];

      const invalid = validateCartridgeNames(cartridges, customValidNames);

      expect(invalid).toHaveLength(1);
      expect(invalid).toContain('component-c');
    });
  });

  describe('Integration: Full Config Generation Flow', () => {
    it('should generate valid config for multiple components', () => {
      const components: Component[] = [
        {
          id: 'watson-ml',
          name: 'Watson Machine Learning',
          originalName: 'wml',
          description: 'ML platform',
          category: 'AI & Machine Learning',
          state: 'installed',
          restrictions: [],
          externalDependencies: [],
          serviceDependencies: [],
          componentDependencies: [],
          configSchema: { fields: [] },
        },
        {
          id: 'watson-studio',
          name: 'Watson Studio',
          originalName: 'ws',
          description: 'Data science',
          category: 'AI & Machine Learning',
          state: 'installed',
          restrictions: [],
          externalDependencies: [],
          serviceDependencies: [],
          componentDependencies: [],
          configSchema: { fields: [] },
        },
        {
          id: 'db2-oltp',
          name: 'Db2 OLTP',
          originalName: 'db2',
          description: 'Database',
          category: 'Data Management',
          state: 'installed',
          restrictions: [],
          externalDependencies: [],
          serviceDependencies: [],
          componentDependencies: [],
          configSchema: { fields: [] },
        },
      ];

      const componentConfigs = {
        'watson-ml': { size: 'small' },
        'watson-studio': { size: 'medium' },
        'db2-oltp': { size: 'large' },
      };

      const config = generateConfigYAML(components, componentConfigs);

      // Validate structure
      expect(config.global_config).toBeDefined();
      expect(config.openshift).toHaveLength(1);
      expect(config.cp4d).toHaveLength(1);

      // Validate cartridges
      const cartridges = config.cp4d[0].cartridges;
      expect(cartridges.length).toBe(5); // 2 foundation + 3 components

      // Validate cartridge names
      const cartridgeNames = cartridges.map(c => c.name);
      const invalidNames = validateCartridgeNames(cartridges, VALID_CARTRIDGE_NAMES);

      expect(invalidNames).toHaveLength(0);
      expect(cartridgeNames).toContain('cp-foundation');
      expect(cartridgeNames).toContain('lite');
      expect(cartridgeNames).toContain('wml');
      expect(cartridgeNames).toContain('ws');
      expect(cartridgeNames).toContain('db2');
    });

    it('should handle components with no config', () => {
      const components: Component[] = [
        {
          id: 'watson-ml',
          name: 'Watson Machine Learning',
          originalName: 'wml',
          description: 'ML platform',
          category: 'AI & Machine Learning',
          state: 'installed',
          restrictions: [],
          externalDependencies: [],
          serviceDependencies: [],
          componentDependencies: [],
          configSchema: { fields: [] },
        },
      ];

      const config = generateConfigYAML(components, {});

      const wmlCartridge = config.cp4d[0].cartridges.find(c => c.name === 'wml');
      expect(wmlCartridge).toBeDefined();
      expect(wmlCartridge?.state).toBe('installed');
      expect(wmlCartridge?.description).toBe('ML platform');
    });
  });
});

// Made with Bob