/**
 * Schema Validation Tests
 * Validates that all component schemas use correct originalName as keys
 */

import { describe, it, expect } from 'vitest';
import { getComponentSchema, hasComponentSchema } from '../componentSchemas';
import { MOCK_COMPONENTS } from '../../constants/mockComponents';
import { VALID_CARTRIDGE_NAMES } from '../../services/configGenerator';
import type { Component } from '../../types';

describe('Component Schema Validation', () => {
  describe('Schema Key Validation', () => {
    it('should use originalName as schema key for all components with schemas', () => {
      const errors: string[] = [];
      
      for (const component of MOCK_COMPONENTS) {
        // Skip disabled components
        if (component.disabled) continue;
        
        // Check if component has a schema
        const hasSchema = hasComponentSchema(component.id);
        
        if (hasSchema) {
          // Try to get schema using originalName (correct way)
          const schemaByOriginalName = getComponentSchema(component.originalName);
          
          // Try to get schema using id (wrong way)
          const schemaById = getComponentSchema(component.id);
          
          // Schema should be accessible by originalName
          if (!schemaByOriginalName) {
            errors.push(
              `Component "${component.name}" (id: ${component.id}, originalName: ${component.originalName}): ` +
              `Schema NOT found using originalName "${component.originalName}"`
            );
          }
          
          // If schema is found by id but not by originalName, that's wrong
          if (schemaById && !schemaByOriginalName && component.id !== component.originalName) {
            errors.push(
              `Component "${component.name}" (id: ${component.id}, originalName: ${component.originalName}): ` +
              `Schema found using id "${component.id}" but should use originalName "${component.originalName}"`
            );
          }
          
          // Verify schema componentName matches originalName
          if (schemaByOriginalName && schemaByOriginalName.componentName !== component.originalName) {
            errors.push(
              `Component "${component.name}" (id: ${component.id}, originalName: ${component.originalName}): ` +
              `Schema componentName is "${schemaByOriginalName.componentName}" but should be "${component.originalName}"`
            );
          }
        }
      }
      
      if (errors.length > 0) {
        console.error('\n❌ Schema Key Validation Errors:\n');
        errors.forEach(error => console.error(`  - ${error}`));
        console.error('\n');
      }
      
      expect(errors).toHaveLength(0);
    });

    it('should have valid originalName for all components', () => {
      const errors: string[] = [];
      
      for (const component of MOCK_COMPONENTS) {
        // Skip disabled components
        if (component.disabled) continue;
        
        // Check if originalName is valid (exists in VALID_CARTRIDGE_NAMES)
        if (!VALID_CARTRIDGE_NAMES.includes(component.originalName)) {
          errors.push(
            `Component "${component.name}" (id: ${component.id}): ` +
            `originalName "${component.originalName}" is NOT in VALID_CARTRIDGE_NAMES`
          );
        }
      }
      
      if (errors.length > 0) {
        console.error('\n❌ originalName Validation Errors:\n');
        errors.forEach(error => console.error(`  - ${error}`));
        console.error('\n');
      }
      
      expect(errors).toHaveLength(0);
    });

    it('should not have schemas using component.id when id !== originalName', () => {
      const errors: string[] = [];
      
      for (const component of MOCK_COMPONENTS) {
        // Skip disabled components
        if (component.disabled) continue;
        
        // Skip if id === originalName (no issue in this case)
        if (component.id === component.originalName) continue;
        
        // Check if a SPECIFIC schema exists using id (wrong)
        // Use hasComponentSchema to check for explicit schema, not default
        const hasSchemaById = hasComponentSchema(component.id);
        
        if (hasSchemaById) {
          errors.push(
            `Component "${component.name}": ` +
            `Schema found using id "${component.id}" but should use originalName "${component.originalName}"`
          );
        }
      }
      
      if (errors.length > 0) {
        console.error('\n❌ Schema ID Usage Errors:\n');
        errors.forEach(error => console.error(`  - ${error}`));
        console.error('\n');
      }
      
      expect(errors).toHaveLength(0);
    });
  });

  describe('Component Coverage', () => {
    it('should list all components with schemas', () => {
      const componentsWithSchemas = MOCK_COMPONENTS.filter(c => 
        !c.disabled && hasComponentSchema(c.originalName)
      );
      
      console.log(`\n✅ Components with schemas: ${componentsWithSchemas.length}`);
      componentsWithSchemas.forEach(c => {
        console.log(`  - ${c.name} (${c.originalName})`);
      });
      
      expect(componentsWithSchemas.length).toBeGreaterThan(0);
    });

    it('should list all components without schemas', () => {
      const componentsWithoutSchemas = MOCK_COMPONENTS.filter(c => 
        !c.disabled && !hasComponentSchema(c.originalName)
      );
      
      console.log(`\n📝 Components without schemas: ${componentsWithoutSchemas.length}`);
      componentsWithoutSchemas.forEach(c => {
        console.log(`  - ${c.name} (${c.originalName})`);
      });
      
      // This is informational, not a failure
      expect(componentsWithoutSchemas).toBeDefined();
    });

    it('should list all disabled components', () => {
      const disabledComponents = MOCK_COMPONENTS.filter(c => c.disabled);
      
      console.log(`\n⚠️  Disabled components: ${disabledComponents.length}`);
      disabledComponents.forEach(c => {
        console.log(`  - ${c.name} (${c.originalName}): ${c.disabledReason}`);
      });
      
      expect(disabledComponents.length).toBe(8);
    });
  });

  describe('ID vs originalName Mapping', () => {
    it('should document all components where id !== originalName', () => {
      const differentMappings = MOCK_COMPONENTS.filter(c => 
        !c.disabled && c.id !== c.originalName
      );
      
      console.log(`\n🔄 Components where id !== originalName: ${differentMappings.length}`);
      differentMappings.forEach(c => {
        console.log(`  - ${c.name}`);
        console.log(`    UI id: "${c.id}"`);
        console.log(`    Backend originalName: "${c.originalName}"`);
      });
      
      // This is informational
      expect(differentMappings).toBeDefined();
    });

    it('should verify all originalNames are unique', () => {
      const originalNames = MOCK_COMPONENTS
        .filter(c => !c.disabled)
        .map(c => c.originalName);
      
      const uniqueOriginalNames = new Set(originalNames);
      
      if (originalNames.length !== uniqueOriginalNames.size) {
        const duplicates = originalNames.filter((name, index) => 
          originalNames.indexOf(name) !== index
        );
        
        console.error('\n❌ Duplicate originalNames found:');
        duplicates.forEach(name => console.error(`  - ${name}`));
      }
      
      expect(originalNames.length).toBe(uniqueOriginalNames.size);
    });

    it('should verify all component ids are unique', () => {
      const ids = MOCK_COMPONENTS.map(c => c.id);
      const uniqueIds = new Set(ids);
      
      if (ids.length !== uniqueIds.size) {
        const duplicates = ids.filter((id, index) => 
          ids.indexOf(id) !== index
        );
        
        console.error('\n❌ Duplicate component ids found:');
        duplicates.forEach(id => console.error(`  - ${id}`));
      }
      
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe('Reference Config Alignment', () => {
    it('should have all supported components in VALID_CARTRIDGE_NAMES', () => {
      const errors: string[] = [];
      
      for (const component of MOCK_COMPONENTS) {
        // Skip disabled components
        if (component.disabled) continue;
        
        if (!VALID_CARTRIDGE_NAMES.includes(component.originalName)) {
          errors.push(
            `Component "${component.name}" originalName "${component.originalName}" ` +
            `not found in VALID_CARTRIDGE_NAMES (reference-config.yaml)`
          );
        }
      }
      
      if (errors.length > 0) {
        console.error('\n❌ Reference Config Alignment Errors:\n');
        errors.forEach(error => console.error(`  - ${error}`));
        console.error('\n');
      }
      
      expect(errors).toHaveLength(0);
    });

    it('should document coverage of VALID_CARTRIDGE_NAMES', () => {
      const supportedCartridges = MOCK_COMPONENTS
        .filter(c => !c.disabled)
        .map(c => c.originalName);
      
      const unsupportedCartridges = VALID_CARTRIDGE_NAMES.filter(
        name => !supportedCartridges.includes(name) && 
               name !== 'cp-foundation' && 
               name !== 'lite'
      );
      
      const coverage = ((supportedCartridges.length / (VALID_CARTRIDGE_NAMES.length - 2)) * 100).toFixed(1);
      
      console.log(`\n📊 Coverage: ${supportedCartridges.length}/${VALID_CARTRIDGE_NAMES.length - 2} cartridges (${coverage}%)`);
      
      if (unsupportedCartridges.length > 0) {
        console.log(`\n📋 Cartridges in reference-config.yaml but not in UI (${unsupportedCartridges.length}):`);
        unsupportedCartridges.forEach(name => console.log(`  - ${name}`));
      }
      
      // This is informational
      expect(coverage).toBeDefined();
    });
  });
});

// Made with Bob