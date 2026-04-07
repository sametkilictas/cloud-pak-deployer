/**
 * Conditional Expression Evaluator
 * 
 * Evaluates conditional dependency expressions from YAML configuration.
 * Supports component selection checks, version comparisons, and logical operators.
 * 
 * Example expressions:
 * - "component:watson-studio is selected"
 * - "version >= 5.3.0"
 * - "component:wml is selected AND version >= 5.3.0"
 */

export interface EvaluationContext {
  selectedComponents: Set<string>;
  componentVersions: Map<string, string>;
  platformVersion?: string;
  installationOptions?: Record<string, any>;
}

export class ConditionalEvaluator {
  /**
   * Evaluate a conditional expression
   * @param expression - The conditional expression to evaluate
   * @param context - The evaluation context containing selected components and versions
   * @returns true if the condition is met, false otherwise
   */
  evaluate(expression: string, context: EvaluationContext): boolean {
    if (!expression || expression.trim().length === 0) {
      return false;
    }

    try {
      const tokens = this.tokenize(expression);
      return this.evaluateTokens(tokens, context);
    } catch (error) {
      // Silently return false for unparseable expressions
      // These are often natural language descriptions that don't need evaluation
      return false;
    }
  }

  /**
   * Tokenize an expression into individual tokens
   * @param expression - The expression to tokenize
   * @returns Array of tokens
   */
  private tokenize(expression: string): string[] {
    return expression
      .replace(/\(/g, ' ( ')
      .replace(/\)/g, ' ) ')
      .split(/\s+/)
      .filter(t => t.length > 0);
  }

  /**
   * Evaluate tokenized expression
   * @param tokens - Array of tokens
   * @param context - Evaluation context
   * @returns Evaluation result
   */
  private evaluateTokens(tokens: string[], context: EvaluationContext): boolean {
    const expr = tokens.join(' ');

    // Handle logical operators
    if (expr.includes(' AND ')) {
      const parts = expr.split(' AND ');
      return parts.every(part => this.evaluate(part.trim(), context));
    }

    if (expr.includes(' OR ')) {
      const parts = expr.split(' OR ');
      return parts.some(part => this.evaluate(part.trim(), context));
    }

    if (expr.startsWith('NOT ')) {
      const innerExpr = expr.substring(4).trim();
      return !this.evaluate(innerExpr, context);
    }

    // Handle parentheses
    if (expr.includes('(') && expr.includes(')')) {
      return this.evaluateWithParentheses(expr, context);
    }

    // Pattern: "component:X is selected" or "X is selected"
    const componentMatch = expr.match(/(?:component:)?(\S+)\s+is\s+(?:selected|installed|enabled)/i);
    if (componentMatch) {
      const componentId = componentMatch[1];
      return context.selectedComponents.has(componentId);
    }

    // Pattern: "service:X is selected" (alias for component)
    const serviceMatch = expr.match(/service:(\S+)\s+is\s+(?:selected|installed|enabled)/i);
    if (serviceMatch) {
      const serviceId = serviceMatch[1];
      return context.selectedComponents.has(serviceId);
    }

    // Pattern: "version >= X.X.X" or "version > X.X.X" etc.
    const versionMatch = expr.match(/version\s*(>=|<=|>|<|==|=)\s*(\d+\.\d+(?:\.\d+)?)/i);
    if (versionMatch && context.platformVersion) {
      const operator = versionMatch[1];
      const targetVersion = versionMatch[2];
      return this.compareVersions(context.platformVersion, operator, targetVersion);
    }

    // Pattern: "option:X is true/false"
    const optionMatch = expr.match(/option:(\S+)\s+is\s+(true|false)/i);
    if (optionMatch && context.installationOptions) {
      const optionName = optionMatch[1];
      const expectedValue = optionMatch[2].toLowerCase() === 'true';
      return context.installationOptions[optionName] === expectedValue;
    }

    // Pattern: "option:X equals Y"
    const optionEqualsMatch = expr.match(/option:(\S+)\s+equals\s+(\S+)/i);
    if (optionEqualsMatch && context.installationOptions) {
      const optionName = optionEqualsMatch[1];
      const expectedValue = optionEqualsMatch[2];
      return context.installationOptions[optionName] === expectedValue;
    }

    // Default: return false for unparseable expressions
    // Silently fail for natural language descriptions
    return false;
  }

  /**
   * Evaluate expression with parentheses
   * @param expr - Expression with parentheses
   * @param context - Evaluation context
   * @returns Evaluation result
   */
  private evaluateWithParentheses(expr: string, context: EvaluationContext): boolean {
    // Find innermost parentheses
    const innerMatch = expr.match(/\(([^()]+)\)/);
    if (!innerMatch) {
      // No more parentheses, evaluate directly
      return this.evaluate(expr, context);
    }

    const innerExpr = innerMatch[1];
    const innerResult = this.evaluate(innerExpr, context);
    
    // Replace the parenthesized expression with its result
    const replacement = innerResult ? 'TRUE' : 'FALSE';
    const newExpr = expr.replace(innerMatch[0], replacement);
    
    // Continue evaluation
    return this.evaluateWithParentheses(newExpr, context);
  }

  /**
   * Compare two version strings
   * @param current - Current version
   * @param operator - Comparison operator (>=, <=, >, <, ==, =)
   * @param target - Target version
   * @returns Comparison result
   */
  private compareVersions(current: string, operator: string, target: string): boolean {
    const parseVersion = (v: string): number[] => {
      const parts = v.split('.').map(Number);
      // Ensure we have at least 3 parts (major.minor.patch)
      while (parts.length < 3) {
        parts.push(0);
      }
      return parts;
    };

    const currentParts = parseVersion(current);
    const targetParts = parseVersion(target);

    // Compare each part
    for (let i = 0; i < 3; i++) {
      const c = currentParts[i] || 0;
      const t = targetParts[i] || 0;

      if (c !== t) {
        switch (operator) {
          case '>=':
            return c >= t;
          case '<=':
            return c <= t;
          case '>':
            return c > t;
          case '<':
            return c < t;
          case '==':
          case '=':
            return false; // Not equal
        }
      }
    }

    // All parts are equal
    return operator === '>=' || operator === '<=' || operator === '==' || operator === '=';
  }

  /**
   * Validate an expression syntax without evaluating it
   * @param expression - Expression to validate
   * @returns true if syntax is valid, false otherwise
   */
  validateSyntax(expression: string): boolean {
    if (!expression || expression.trim().length === 0) {
      return false;
    }

    try {
      const tokens = this.tokenize(expression);
      
      // Check for balanced parentheses
      let parenCount = 0;
      for (const token of tokens) {
        if (token === '(') parenCount++;
        if (token === ')') parenCount--;
        if (parenCount < 0) return false;
      }
      if (parenCount !== 0) return false;

      // Check for valid patterns
      const expr = tokens.join(' ');
      const validPatterns = [
        /component:\S+\s+is\s+selected/i,
        /service:\S+\s+is\s+selected/i,
        /version\s*(>=|<=|>|<|==|=)\s*\d+\.\d+(?:\.\d+)?/i,
        /option:\S+\s+is\s+(true|false)/i,
        /option:\S+\s+equals\s+\S+/i,
        /\bAND\b/i,
        /\bOR\b/i,
        /\bNOT\b/i,
      ];

      // Remove logical operators and parentheses for pattern matching
      const cleanExpr = expr
        .replace(/\bAND\b/gi, '')
        .replace(/\bOR\b/gi, '')
        .replace(/\bNOT\b/gi, '')
        .replace(/[()]/g, '')
        .trim();

      if (cleanExpr.length === 0) return false;

      // Check if at least one pattern matches
      return validPatterns.some(pattern => pattern.test(cleanExpr));
    } catch (error) {
      return false;
    }
  }

  /**
   * Extract component IDs referenced in an expression
   * @param expression - Expression to analyze
   * @returns Set of component IDs
   */
  extractComponentIds(expression: string): Set<string> {
    const componentIds = new Set<string>();
    
    // Match component:X patterns
    const componentMatches = expression.matchAll(/component:(\S+)/gi);
    for (const match of componentMatches) {
      componentIds.add(match[1]);
    }

    // Match service:X patterns (alias for component)
    const serviceMatches = expression.matchAll(/service:(\S+)/gi);
    for (const match of serviceMatches) {
      componentIds.add(match[1]);
    }

    return componentIds;
  }

  /**
   * Get a human-readable description of an expression
   * @param expression - Expression to describe
   * @returns Human-readable description
   */
  describeExpression(expression: string): string {
    if (!expression || expression.trim().length === 0) {
      return 'No condition';
    }

    // Replace technical syntax with readable text
    let description = expression
      .replace(/component:(\S+)\s+is\s+selected/gi, '$1 is selected')
      .replace(/service:(\S+)\s+is\s+selected/gi, '$1 service is selected')
      .replace(/version\s*(>=|<=|>|<|==|=)\s*(\d+\.\d+(?:\.\d+)?)/gi, 'version $1 $2')
      .replace(/option:(\S+)\s+is\s+(true|false)/gi, '$1 option is $2')
      .replace(/option:(\S+)\s+equals\s+(\S+)/gi, '$1 option equals $2')
      .replace(/\bAND\b/gi, 'and')
      .replace(/\bOR\b/gi, 'or')
      .replace(/\bNOT\b/gi, 'not');

    return description;
  }
}

// Export singleton instance
export const conditionalEvaluator = new ConditionalEvaluator();

// Made with Bob