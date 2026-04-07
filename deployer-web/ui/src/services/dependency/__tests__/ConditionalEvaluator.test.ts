/**
 * Unit Tests for ConditionalEvaluator
 * Tests expression evaluation, token parsing, and error handling
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ConditionalEvaluator, EvaluationContext } from '../ConditionalEvaluator';

describe('ConditionalEvaluator', () => {
  let evaluator: ConditionalEvaluator;
  let context: EvaluationContext;

  beforeEach(() => {
    context = {
      selectedComponents: new Set<string>(),
      componentVersions: new Map<string, string>(),
      platformVersion: '5.3.0',
      installationOptions: {}
    };
    evaluator = new ConditionalEvaluator();
  });

  describe('Simple Boolean Expressions', () => {
    it('should evaluate simple component selection', () => {
      context.selectedComponents.add('watson-studio');
      const result = evaluator.evaluate('watson-studio is selected', context);
      expect(result).toBe(true);
    });

    it('should return false for unselected component', () => {
      const result = evaluator.evaluate('watson-studio is selected', context);
      expect(result).toBe(false);
    });

    it('should handle "is installed" synonym', () => {
      context.selectedComponents.add('watson-ml');
      const result = evaluator.evaluate('watson-ml is installed', context);
      expect(result).toBe(true);
    });

    it('should handle "is enabled" synonym', () => {
      context.selectedComponents.add('watson-openscale');
      const result = evaluator.evaluate('watson-openscale is enabled', context);
      expect(result).toBe(true);
    });
  });

  describe('Logical Operators', () => {
    it('should evaluate AND operator', () => {
      context.selectedComponents.add('watson-studio');
      context.selectedComponents.add('watson-ml');
      const result = evaluator.evaluate('watson-studio is selected AND watson-ml is selected', context);
      expect(result).toBe(true);
    });

    it('should return false for AND with one missing component', () => {
      context.selectedComponents.add('watson-studio');
      const result = evaluator.evaluate('watson-studio is selected AND watson-ml is selected', context);
      expect(result).toBe(false);
    });

    it('should evaluate OR operator', () => {
      context.selectedComponents.add('watson-studio');
      const result = evaluator.evaluate('watson-studio is selected OR watson-ml is selected', context);
      expect(result).toBe(true);
    });

    it('should return false for OR with no components selected', () => {
      const result = evaluator.evaluate('watson-studio is selected OR watson-ml is selected', context);
      expect(result).toBe(false);
    });

    it('should handle complex AND/OR combinations', () => {
      context.selectedComponents.add('watson-studio');
      context.selectedComponents.add('watson-ml');
      const result = evaluator.evaluate(
        '(watson-studio is selected AND watson-ml is selected) OR watson-openscale is selected',
        context
      );
      expect(result).toBe(true);
    });
  });

  describe('Parentheses and Grouping', () => {
    it('should respect parentheses precedence', () => {
      context.selectedComponents.add('watson-ml');
      context.selectedComponents.add('watson-openscale');
      const result = evaluator.evaluate(
        'watson-studio is selected OR (watson-ml is selected AND watson-openscale is selected)',
        context
      );
      expect(result).toBe(true);
    });

    it('should handle nested parentheses', () => {
      context.selectedComponents.add('watson-studio');
      context.selectedComponents.add('watson-ml');
      const result = evaluator.evaluate(
        '((watson-studio is selected AND watson-ml is selected) OR watson-openscale is selected)',
        context
      );
      expect(result).toBe(true);
    });

    it('should handle multiple levels of nesting', () => {
      context.selectedComponents.add('component-a');
      context.selectedComponents.add('component-b');
      context.selectedComponents.add('component-c');
      const result = evaluator.evaluate(
        '(component-a is selected AND (component-b is selected OR component-c is selected))',
        context
      );
      expect(result).toBe(true);
    });
  });

  describe('Feature Flags and Options', () => {
    it('should evaluate feature flag expressions', () => {
      const result = evaluator.evaluate('feature.analytics is enabled', context);
      expect(result).toBe(false); // Default behavior for unknown features
    });

    it('should handle option-based conditions', () => {
      const result = evaluator.evaluate('option.bigpv is true', context);
      expect(result).toBe(false); // Default behavior for unknown options
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty expression', () => {
      const result = evaluator.evaluate('', context);
      expect(result).toBe(false);
    });

    it('should handle whitespace-only expression', () => {
      const result = evaluator.evaluate('   ', context);
      expect(result).toBe(false);
    });

    it('should handle malformed expressions gracefully', () => {
      const result = evaluator.evaluate('watson-studio is', context);
      expect(result).toBe(false);
    });

    it('should handle expressions with extra spaces', () => {
      context.selectedComponents.add('watson-studio');
      const result = evaluator.evaluate('  watson-studio   is   selected  ', context);
      expect(result).toBe(true);
    });

    it('should handle case-insensitive operators', () => {
      context.selectedComponents.add('watson-studio');
      context.selectedComponents.add('watson-ml');
      const result = evaluator.evaluate('watson-studio is selected and watson-ml is selected', context);
      expect(result).toBe(true);
    });

    it('should handle natural language expressions gracefully', () => {
      const result = evaluator.evaluate('conversational skills or conversational search features are used', context);
      expect(result).toBe(false); // Should not throw, just return false
    });

    it('should handle expressions with special characters', () => {
      context.selectedComponents.add('watson-ml-accelerator');
      const result = evaluator.evaluate('watson-ml-accelerator is selected', context);
      expect(result).toBe(true);
    });
  });

  describe('Component Name Variations', () => {
    it('should handle component names with hyphens', () => {
      context.selectedComponents.add('watson-ml-accelerator');
      const result = evaluator.evaluate('watson-ml-accelerator is selected', context);
      expect(result).toBe(true);
    });

    it('should handle component names with underscores', () => {
      context.selectedComponents.add('watson_ml_accelerator');
      const result = evaluator.evaluate('watson_ml_accelerator is selected', context);
      expect(result).toBe(true);
    });

    it('should handle component names with numbers', () => {
      context.selectedComponents.add('db2-v11');
      const result = evaluator.evaluate('db2-v11 is selected', context);
      expect(result).toBe(true);
    });
  });

  describe('Complex Real-World Scenarios', () => {
    it('should evaluate watsonx.ai conditional dependency', () => {
      context.selectedComponents.add('watson-assistant');
      const result = evaluator.evaluate(
        'watson-assistant is selected AND option.watsonxAiType is embedded',
        context
      );
      expect(result).toBe(false); // Option not set
    });

    it('should evaluate Watson Discovery storage dependency', () => {
      context.selectedComponents.add('watson-discovery');
      const result = evaluator.evaluate(
        'watson-discovery is selected AND option.discovery_deployment_type is Production',
        context
      );
      expect(result).toBe(false); // Option not set
    });

    it('should evaluate multiple component dependencies', () => {
      context.selectedComponents.add('watson-studio');
      context.selectedComponents.add('watson-ml');
      context.selectedComponents.add('watson-openscale');
      const result = evaluator.evaluate(
        '(watson-studio is selected AND watson-ml is selected) OR watson-openscale is selected',
        context
      );
      expect(result).toBe(true);
    });

    it('should handle DataStage conditional components', () => {
      context.selectedComponents.add('datastage-ent-plus');
      const result = evaluator.evaluate(
        'datastage-ent-plus is selected OR datastage-ent is selected',
        context
      );
      expect(result).toBe(true);
    });
  });

  describe('Token Parsing', () => {
    it('should correctly tokenize simple expression', () => {
      context.selectedComponents.add('watson-studio');
      const result = evaluator.evaluate('watson-studio is selected', context);
      expect(result).toBe(true);
    });

    it('should handle expressions with multiple operators', () => {
      context.selectedComponents.add('component-a');
      context.selectedComponents.add('component-b');
      context.selectedComponents.add('component-c');
      const result = evaluator.evaluate(
        'component-a is selected AND component-b is selected AND component-c is selected',
        context
      );
      expect(result).toBe(true);
    });

    it('should handle mixed case in component names', () => {
      context.selectedComponents.add('Watson-Studio');
      const result = evaluator.evaluate('Watson-Studio is selected', context);
      expect(result).toBe(true);
    });
  });

  describe('Performance and Optimization', () => {
    it('should handle long expressions efficiently', () => {
      context.selectedComponents.add('comp1');
      context.selectedComponents.add('comp2');
      context.selectedComponents.add('comp3');
      
      const longExpression = Array.from({ length: 10 }, (_, i) => 
        `comp${(i % 3) + 1} is selected`
      ).join(' OR ');
      
      const result = evaluator.evaluate(longExpression, context);
      expect(result).toBe(true);
    });

    it('should handle deeply nested expressions', () => {
      context.selectedComponents.add('a');
      context.selectedComponents.add('b');
      context.selectedComponents.add('c');
      
      const result = evaluator.evaluate(
        '(((a is selected AND b is selected) OR c is selected))',
        context
      );
      expect(result).toBe(true);
    });
  });

  describe('State Management', () => {
    it('should reflect changes in selected components', () => {
      const result1 = evaluator.evaluate('watson-studio is selected', context);
      expect(result1).toBe(false);
      
      context.selectedComponents.add('watson-studio');
      const result2 = evaluator.evaluate('watson-studio is selected', context);
      expect(result2).toBe(true);
    });

    it('should handle component removal', () => {
      context.selectedComponents.add('watson-studio');
      const result1 = evaluator.evaluate('watson-studio is selected', context);
      expect(result1).toBe(true);
      
      context.selectedComponents.delete('watson-studio');
      const result2 = evaluator.evaluate('watson-studio is selected', context);
      expect(result2).toBe(false);
    });
  });
});

// Made with Bob
