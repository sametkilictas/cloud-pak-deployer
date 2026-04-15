/**
 * Config Validator Service
 * Validates generated config.yaml against reference-config.yaml structure
 * Ensures cartridge names, structure, and parameters match expected format
 */

import { CartridgeConfig, ConfigYAML, VALID_CARTRIDGE_NAMES } from './configGenerator';

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validate cartridge names against reference config
 */
export function validateCartridgeNames(cartridges: CartridgeConfig[]): ValidationError[] {
  const errors: ValidationError[] = [];
  
  for (const cartridge of cartridges) {
    if (!VALID_CARTRIDGE_NAMES.includes(cartridge.name)) {
      errors.push({
        field: `cartridges.${cartridge.name}`,
        message: `Invalid cartridge name: "${cartridge.name}". Not found in reference-config.yaml`,
        severity: 'error'
      });
    }
  }
  
  return errors;
}

/**
 * Validate cartridge state values
 */
export function validateCartridgeStates(cartridges: CartridgeConfig[]): ValidationError[] {
  const errors: ValidationError[] = [];
  
  for (const cartridge of cartridges) {
    if (cartridge.state && !['installed', 'removed'].includes(cartridge.state)) {
      errors.push({
        field: `cartridges.${cartridge.name}.state`,
        message: `Invalid state: "${cartridge.state}". Must be "installed" or "removed"`,
        severity: 'error'
      });
    }
  }
  
  return errors;
}

/**
 * Validate required foundation cartridges are present
 */
export function validateFoundationCartridges(cartridges: CartridgeConfig[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const cartridgeNames = cartridges.map(c => c.name);
  
  if (!cartridgeNames.includes('cp-foundation')) {
    errors.push({
      field: 'cartridges',
      message: 'Missing required cartridge: cp-foundation',
      severity: 'error'
    });
  }
  
  if (!cartridgeNames.includes('lite')) {
    errors.push({
      field: 'cartridges',
      message: 'Missing required cartridge: lite',
      severity: 'error'
    });
  }
  
  return errors;
}

/**
 * Validate global config structure
 */
export function validateGlobalConfig(config: ConfigYAML): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!config.global_config) {
    errors.push({
      field: 'global_config',
      message: 'Missing required section: global_config',
      severity: 'error'
    });
    return errors;
  }
  
  const required = ['environment_name', 'cloud_platform', 'env_id'];
  for (const field of required) {
    if (!config.global_config[field as keyof typeof config.global_config]) {
      errors.push({
        field: `global_config.${field}`,
        message: `Missing required field: ${field}`,
        severity: 'error'
      });
    }
  }
  
  return errors;
}

/**
 * Validate OpenShift config structure
 */
export function validateOpenShiftConfig(config: ConfigYAML): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!config.openshift || config.openshift.length === 0) {
    errors.push({
      field: 'openshift',
      message: 'Missing required section: openshift',
      severity: 'error'
    });
    return errors;
  }
  
  const ocp = config.openshift[0];
  const required = ['name', 'ocp_version', 'cluster_name', 'domain_name'];
  
  for (const field of required) {
    if (!ocp[field]) {
      errors.push({
        field: `openshift.${field}`,
        message: `Missing required field: ${field}`,
        severity: 'error'
      });
    }
  }
  
  return errors;
}

/**
 * Validate CP4D config structure
 */
export function validateCP4DConfig(config: ConfigYAML): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!config.cp4d || config.cp4d.length === 0) {
    errors.push({
      field: 'cp4d',
      message: 'Missing required section: cp4d',
      severity: 'error'
    });
    return errors;
  }
  
  const cp4d = config.cp4d[0];
  const required = ['project', 'openshift_cluster_name', 'cp4d_version', 'cartridges'];
  
  for (const field of required) {
    if (!cp4d[field as keyof typeof cp4d]) {
      errors.push({
        field: `cp4d.${field}`,
        message: `Missing required field: ${field}`,
        severity: 'error'
      });
    }
  }
  
  return errors;
}

/**
 * Check for duplicate cartridge names
 */
export function validateNoDuplicateCartridges(cartridges: CartridgeConfig[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const seen = new Set<string>();
  
  for (const cartridge of cartridges) {
    if (seen.has(cartridge.name)) {
      errors.push({
        field: `cartridges.${cartridge.name}`,
        message: `Duplicate cartridge: "${cartridge.name}"`,
        severity: 'error'
      });
    }
    seen.add(cartridge.name);
  }
  
  return errors;
}

/**
 * Validate complete config.yaml structure
 */
export function validateConfig(config: ConfigYAML): ValidationResult {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationError[] = [];
  
  // Validate structure
  allErrors.push(...validateGlobalConfig(config));
  allErrors.push(...validateOpenShiftConfig(config));
  allErrors.push(...validateCP4DConfig(config));
  
  // Validate cartridges if CP4D config exists
  if (config.cp4d && config.cp4d.length > 0) {
    const cartridges = config.cp4d[0].cartridges;
    
    allErrors.push(...validateCartridgeNames(cartridges));
    allErrors.push(...validateCartridgeStates(cartridges));
    allErrors.push(...validateFoundationCartridges(cartridges));
    allErrors.push(...validateNoDuplicateCartridges(cartridges));
  }
  
  // Separate errors and warnings
  const errors = allErrors.filter(e => e.severity === 'error');
  const warnings = allErrors.filter(e => e.severity === 'warning');
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate that component originalNames match reference config
 */
export function validateComponentOriginalNames(
  components: Array<{ id: string; originalName: string }>
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  for (const component of components) {
    if (!VALID_CARTRIDGE_NAMES.includes(component.originalName)) {
      errors.push({
        field: `component.${component.id}`,
        message: `Component "${component.id}" has invalid originalName: "${component.originalName}". Not found in reference-config.yaml`,
        severity: 'error'
      });
    }
  }
  
  return errors;
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(result: ValidationResult): string {
  const lines: string[] = [];
  
  if (result.errors.length > 0) {
    lines.push('Errors:');
    for (const error of result.errors) {
      lines.push(`  - ${error.field}: ${error.message}`);
    }
  }
  
  if (result.warnings.length > 0) {
    if (lines.length > 0) lines.push('');
    lines.push('Warnings:');
    for (const warning of result.warnings) {
      lines.push(`  - ${warning.field}: ${warning.message}`);
    }
  }
  
  return lines.join('\n');
}

// Made with Bob