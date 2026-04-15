/**
 * TestConfigModal Component
 * 
 * Modal that tests the generated config.yaml against the reference configuration.
 * Validates:
 * - Cartridge names match reference-config.yaml
 * - Structure matches expected format
 * - No duplicate cartridges
 * - Foundation cartridges are present
 * - All required fields are present
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  InlineNotification,
  Accordion,
  AccordionItem,
  Tag,
  CodeSnippet,
  Loading,
} from '@carbon/react';
import {
  Checkmark,
  WarningAlt,
  Error,
  Information,
} from '@carbon/icons-react';
import { useConfigStore } from '../../stores/configStore';
import { useComponentStore } from '../../stores/componentStore';
import { generateConfigYAML, ConfigYAML } from '../../services/configGenerator';
import {
  validateConfig,
  validateCartridgeNames,
  validateFoundationCartridges,
  validateNoDuplicateCartridges,
  validateGlobalConfig,
  validateOpenShiftConfig,
  validateCP4DConfig,
} from '../../services/configValidator';
import './TestConfigModal.css';

interface TestConfigModalProps {
  open: boolean;
  onClose: () => void;
}

interface ValidationResult {
  passed: boolean;
  message: string;
  details?: string[];
  severity: 'success' | 'warning' | 'error' | 'info';
}

interface TestResults {
  overall: 'passed' | 'failed' | 'warning';
  tests: {
    cartridgeNames: ValidationResult;
    structure: ValidationResult;
    duplicates: ValidationResult;
    foundation: ValidationResult;
    generation: ValidationResult;
  };
  generatedYaml?: string;
  timestamp: string;
}

export const TestConfigModal: React.FC<TestConfigModalProps> = ({ open, onClose }) => {
  const { configuration } = useConfigStore();
  const { getSelectedComponentsList } = useComponentStore();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResults | null>(null);

  // Run tests when modal opens
  useEffect(() => {
    if (open) {
      runTests();
    }
  }, [open]);

  const runTests = async () => {
    setTesting(true);
    setResults(null);

    // Simulate async testing (in real app, this might call backend)
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const selectedComponents = getSelectedComponentsList();
      const componentConfigs = configuration?.cp4d[0]?.cartridges?.reduce((acc, cart) => {
        acc[cart.name] = cart;
        return acc;
      }, {} as Record<string, any>) || {};

      // Generate config
      let generatedConfig: ConfigYAML | null = null;
      let generatedYaml = '';
      let generationResult: ValidationResult;

      try {
        generatedConfig = generateConfigYAML(
          selectedComponents,
          componentConfigs,
          configuration?.global_config || {}
        );
        generatedYaml = JSON.stringify(generatedConfig, null, 2); // In real app, convert to YAML
        generationResult = {
          passed: true,
          message: 'Config generation successful',
          severity: 'success',
        };
      } catch (error: any) {
        generationResult = {
          passed: false,
          message: 'Config generation failed',
          details: [error.message],
          severity: 'error',
        };
      }

      // Test 1: Validate cartridge names
      const cartridgeNameErrors = generatedConfig?.cp4d?.[0]?.cartridges
        ? validateCartridgeNames(generatedConfig.cp4d[0].cartridges)
        : [];
      const cartridgeNamesResult: ValidationResult = {
        passed: cartridgeNameErrors.length === 0,
        message: cartridgeNameErrors.length === 0
          ? 'All cartridge names are valid'
          : 'Invalid cartridge names detected',
        details: cartridgeNameErrors.map(e => e.message),
        severity: cartridgeNameErrors.length === 0 ? 'success' : 'error',
      };

      // Test 2: Validate structure
      const structureErrors: string[] = [];
      if (generatedConfig) {
        structureErrors.push(...validateGlobalConfig(generatedConfig).map(e => e.message));
        structureErrors.push(...validateOpenShiftConfig(generatedConfig).map(e => e.message));
        structureErrors.push(...validateCP4DConfig(generatedConfig).map(e => e.message));
      }
      const structureResult: ValidationResult = {
        passed: structureErrors.length === 0,
        message: structureErrors.length === 0
          ? 'Config structure is valid'
          : 'Config structure validation failed',
        details: structureErrors,
        severity: structureErrors.length === 0 ? 'success' : 'error',
      };

      // Test 3: Check for duplicates
      const duplicateErrors = generatedConfig?.cp4d?.[0]?.cartridges
        ? validateNoDuplicateCartridges(generatedConfig.cp4d[0].cartridges)
        : [];
      const duplicatesResult: ValidationResult = {
        passed: duplicateErrors.length === 0,
        message: duplicateErrors.length === 0
          ? 'No duplicate cartridges found'
          : 'Duplicate cartridges detected',
        details: duplicateErrors.map(e => e.message),
        severity: duplicateErrors.length === 0 ? 'success' : 'error',
      };

      // Test 4: Check foundation cartridges
      const foundationErrors = generatedConfig?.cp4d?.[0]?.cartridges
        ? validateFoundationCartridges(generatedConfig.cp4d[0].cartridges)
        : [];
      const foundationResult: ValidationResult = {
        passed: foundationErrors.length === 0,
        message: foundationErrors.length === 0
          ? 'Foundation cartridges are present'
          : 'Missing foundation cartridges',
        details: foundationErrors.map(e => e.message),
        severity: foundationErrors.length === 0 ? 'success' : 'warning',
      };

      // Determine overall result
      const allPassed = [
        generationResult,
        cartridgeNamesResult,
        structureResult,
        duplicatesResult,
      ].every(r => r.passed);

      const hasWarnings = !foundationResult.passed;

      const overall: 'passed' | 'failed' | 'warning' = allPassed
        ? hasWarnings
          ? 'warning'
          : 'passed'
        : 'failed';

      setResults({
        overall,
        tests: {
          generation: generationResult,
          cartridgeNames: cartridgeNamesResult,
          structure: structureResult,
          duplicates: duplicatesResult,
          foundation: foundationResult,
        },
        generatedYaml,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      setResults({
        overall: 'failed',
        tests: {
          generation: {
            passed: false,
            message: 'Test execution failed',
            details: [error.message],
            severity: 'error',
          },
          cartridgeNames: { passed: false, message: 'Not tested', severity: 'error' },
          structure: { passed: false, message: 'Not tested', severity: 'error' },
          duplicates: { passed: false, message: 'Not tested', severity: 'error' },
          foundation: { passed: false, message: 'Not tested', severity: 'error' },
        },
        timestamp: new Date().toISOString(),
      });
    } finally {
      setTesting(false);
    }
  };

  const getResultIcon = (result: ValidationResult) => {
    switch (result.severity) {
      case 'success':
        return <Checkmark size={20} className="test-config-modal__icon--success" />;
      case 'warning':
        return <WarningAlt size={20} className="test-config-modal__icon--warning" />;
      case 'error':
        return <Error size={20} className="test-config-modal__icon--error" />;
      default:
        return <Information size={20} className="test-config-modal__icon--info" />;
    }
  };

  const getResultTag = (result: ValidationResult) => {
    if (result.passed) {
      return <Tag type="green" size="sm">PASSED</Tag>;
    }
    return result.severity === 'warning' ? (
      <Tag type="warm-gray" size="sm">WARNING</Tag>
    ) : (
      <Tag type="red" size="sm">FAILED</Tag>
    );
  };

  return (
    <Modal
      open={open}
      onRequestClose={onClose}
      modalHeading="Test Configuration"
      primaryButtonText="Close"
      secondaryButtonText="Run Tests Again"
      onSecondarySubmit={runTests}
      onRequestSubmit={onClose}
      size="lg"
      className="test-config-modal"
    >
      <div className="test-config-modal__content">
        {/* Header Info */}
        <div className="test-config-modal__header">
          <p className="test-config-modal__description">
            This test validates your generated config.yaml against the reference configuration
            to ensure compatibility with the cloud-pak-deployer backend.
          </p>
        </div>

        {/* Loading State */}
        {testing && (
          <div className="test-config-modal__loading">
            <Loading description="Running validation tests..." withOverlay={false} />
          </div>
        )}

        {/* Results */}
        {!testing && results && (
          <>
            {/* Overall Status */}
            <div className="test-config-modal__overall">
              {results.overall === 'passed' && (
                <InlineNotification
                  kind="success"
                  title="All Tests Passed"
                  subtitle="Your configuration is valid and ready for deployment."
                  lowContrast
                  hideCloseButton
                />
              )}
              {results.overall === 'warning' && (
                <InlineNotification
                  kind="warning"
                  title="Tests Passed with Warnings"
                  subtitle="Your configuration is valid but has some warnings. Review them below."
                  lowContrast
                  hideCloseButton
                />
              )}
              {results.overall === 'failed' && (
                <InlineNotification
                  kind="error"
                  title="Tests Failed"
                  subtitle="Your configuration has errors that must be fixed before deployment."
                  lowContrast
                  hideCloseButton
                />
              )}
            </div>

            {/* Test Results Accordion */}
            <div className="test-config-modal__tests">
              <Accordion>
                {/* Config Generation Test */}
                <AccordionItem
                  title={
                    <div className="test-config-modal__test-title">
                      {getResultIcon(results.tests.generation)}
                      <span>Config Generation</span>
                      {getResultTag(results.tests.generation)}
                    </div>
                  }
                  open={!results.tests.generation.passed}
                >
                  <div className="test-config-modal__test-content">
                    <p>{results.tests.generation.message}</p>
                    {results.tests.generation.details && results.tests.generation.details.length > 0 && (
                      <ul className="test-config-modal__details">
                        {results.tests.generation.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </AccordionItem>

                {/* Cartridge Names Test */}
                <AccordionItem
                  title={
                    <div className="test-config-modal__test-title">
                      {getResultIcon(results.tests.cartridgeNames)}
                      <span>Cartridge Names Validation</span>
                      {getResultTag(results.tests.cartridgeNames)}
                    </div>
                  }
                  open={!results.tests.cartridgeNames.passed}
                >
                  <div className="test-config-modal__test-content">
                    <p>{results.tests.cartridgeNames.message}</p>
                    {results.tests.cartridgeNames.details && results.tests.cartridgeNames.details.length > 0 && (
                      <ul className="test-config-modal__details">
                        {results.tests.cartridgeNames.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    )}
                    <p className="test-config-modal__info">
                      <Information size={16} />
                      All cartridge names must match those in reference-config.yaml
                    </p>
                  </div>
                </AccordionItem>

                {/* Structure Test */}
                <AccordionItem
                  title={
                    <div className="test-config-modal__test-title">
                      {getResultIcon(results.tests.structure)}
                      <span>Config Structure Validation</span>
                      {getResultTag(results.tests.structure)}
                    </div>
                  }
                  open={!results.tests.structure.passed}
                >
                  <div className="test-config-modal__test-content">
                    <p>{results.tests.structure.message}</p>
                    {results.tests.structure.details && results.tests.structure.details.length > 0 && (
                      <ul className="test-config-modal__details">
                        {results.tests.structure.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </AccordionItem>

                {/* Duplicates Test */}
                <AccordionItem
                  title={
                    <div className="test-config-modal__test-title">
                      {getResultIcon(results.tests.duplicates)}
                      <span>Duplicate Cartridges Check</span>
                      {getResultTag(results.tests.duplicates)}
                    </div>
                  }
                  open={!results.tests.duplicates.passed}
                >
                  <div className="test-config-modal__test-content">
                    <p>{results.tests.duplicates.message}</p>
                    {results.tests.duplicates.details && results.tests.duplicates.details.length > 0 && (
                      <ul className="test-config-modal__details">
                        {results.tests.duplicates.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </AccordionItem>

                {/* Foundation Cartridges Test */}
                <AccordionItem
                  title={
                    <div className="test-config-modal__test-title">
                      {getResultIcon(results.tests.foundation)}
                      <span>Foundation Cartridges Check</span>
                      {getResultTag(results.tests.foundation)}
                    </div>
                  }
                  open={!results.tests.foundation.passed}
                >
                  <div className="test-config-modal__test-content">
                    <p>{results.tests.foundation.message}</p>
                    {results.tests.foundation.details && results.tests.foundation.details.length > 0 && (
                      <ul className="test-config-modal__details">
                        {results.tests.foundation.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    )}
                    <p className="test-config-modal__info">
                      <Information size={16} />
                      Foundation cartridges (cp-foundation, lite) are required for all deployments
                    </p>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Test Metadata */}
            <div className="test-config-modal__metadata">
              <p className="test-config-modal__timestamp">
                Test completed at: {new Date(results.timestamp).toLocaleString()}
              </p>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default TestConfigModal;

// Made with Bob