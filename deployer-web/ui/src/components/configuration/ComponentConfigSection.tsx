/**
 * ComponentConfigSection Component
 *
 * Displays configuration forms for selected Cloud Pak components.
 * Uses component schemas to dynamically generate configuration forms.
 */

import React, { useState, useMemo } from 'react';
import {
  Accordion,
  AccordionItem,
  InlineNotification,
  Tag,
  Button,
} from '@carbon/react';
import { Checkmark, WarningAlt, Information } from '@carbon/icons-react';
import { useComponentStore } from '../../stores/componentStore';
import { useConfigStore } from '../../stores/configStore';
import { getComponentSchema, hasComponentSchema } from '../../schemas/componentSchemas';
import { ConfigurationForm } from './ConfigurationForm';
import { ModelConfigurationSection } from './ModelConfigurationSection';
import { Component } from '../../types';
import { WATSONX_AI_MODELS } from '../../data/watsonxAiModels';
import './ComponentConfigSection.css';

interface ComponentConfigSectionProps {
  onValidationChange?: (isValid: boolean) => void;
}

export const ComponentConfigSection: React.FC<ComponentConfigSectionProps> = ({
  onValidationChange,
}) => {
  const { getSelectedComponentsList } = useComponentStore();
  const { configuration, updateComponentConfig } = useConfigStore();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [validationStatus, setValidationStatus] = useState<Record<string, boolean>>({});

  // Get all selected components (all components are configurable, even if they use default schema)
  const configurableComponents = useMemo(() => {
    const selectedList = getSelectedComponentsList();
    return selectedList.sort((a: Component, b: Component) => a.name.localeCompare(b.name));
  }, [getSelectedComponentsList]);

  // Get component configs from configuration
  // NOTE: Cartridge names use originalName, so we need to map by originalName
  const componentConfigs = useMemo(() => {
    if (!configuration?.cp4d?.[0]?.cartridges) return {};
    
    const configs: Record<string, any> = {};
    configuration.cp4d[0].cartridges.forEach((cartridge: any) => {
      configs[cartridge.name] = cartridge;
    });
    return configs;
  }, [configuration]);

  // Calculate overall validation status
  const overallValid = useMemo(() => {
    const allValid = configurableComponents.every((comp: Component) =>
      validationStatus[comp.id] !== false
    );
    return allValid;
  }, [configurableComponents, validationStatus]);

  // Notify parent of validation changes
  React.useEffect(() => {
    onValidationChange?.(overallValid);
  }, [overallValid, onValidationChange]);

  const handleConfigChange = (componentOriginalName: string, config: Record<string, any>) => {
    // Pass originalName to match cartridge name in config store
    updateComponentConfig(componentOriginalName, config);
  };

  const handleValidationChange = (componentId: string, isValid: boolean) => {
    setValidationStatus(prev => ({
      ...prev,
      [componentId]: isValid,
    }));
  };

  const toggleExpanded = (componentId: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(componentId)) {
        next.delete(componentId);
      } else {
        next.add(componentId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedItems(new Set(configurableComponents.map((c: Component) => c.id)));
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  if (configurableComponents.length === 0) {
    return (
      <div className="component-config-section component-config-section--empty">
        <InlineNotification
          kind="info"
          title="No components selected"
          subtitle="Select components from the Component Selection page to configure them here."
          hideCloseButton
        />
      </div>
    );
  }

  return (
    <div className="component-config-section">
      {/* Header */}
      <div className="component-config-section__header">
        <div className="component-config-section__title-row">
          <h3 className="component-config-section__title">
            Component Configuration
          </h3>
          <div className="component-config-section__actions">
            <Button
              kind="ghost"
              size="sm"
              onClick={expandAll}
            >
              Expand All
            </Button>
            <Button
              kind="ghost"
              size="sm"
              onClick={collapseAll}
            >
              Collapse All
            </Button>
          </div>
        </div>
        <p className="component-config-section__description">
          Configure settings for each selected component. Components marked with{' '}
          <Tag type="blue" size="sm">Required</Tag> must be configured before deployment.
        </p>
        <div className="component-config-section__summary">
          <div className="component-config-section__summary-item">
            <span className="component-config-section__summary-label">
              Total Components:
            </span>
            <span className="component-config-section__summary-value">
              {configurableComponents.length}
            </span>
          </div>
          <div className="component-config-section__summary-item">
            <span className="component-config-section__summary-label">
              Validation Status:
            </span>
            <span className="component-config-section__summary-value">
              {overallValid ? (
                <Tag type="green" size="sm" renderIcon={Checkmark}>
                  Valid
                </Tag>
              ) : (
                <Tag type="red" size="sm" renderIcon={WarningAlt}>
                  Invalid
                </Tag>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Component Configuration Accordion */}
      <div className="component-config-section__content">
        <Accordion>
          {configurableComponents.map((component: Component) => {
            // CRITICAL: Use originalName for schema lookup (schemas are registered by originalName)
            const schema = getComponentSchema(component.originalName);
            // CRITICAL: Use originalName to match cartridge name in config
            const config = componentConfigs[component.originalName] || {};
            const isValid = validationStatus[component.id] !== false;
            const isExpanded = expandedItems.has(component.id);

            return (
              <AccordionItem
                key={component.id}
                title={component.name}
                open={isExpanded}
                onHeadingClick={() => toggleExpanded(component.id)}
              >
                <div className="component-config-section__accordion-content">
                  {/* Component Header with Tags */}
                  <div className="component-config-section__component-header">
                    <div className="component-config-section__component-tags">
                      {component.required && (
                        <Tag type="purple" size="sm">
                          Core Component
                        </Tag>
                      )}
                      {component.category && (
                        <Tag type="cool-gray" size="sm">
                          {component.category}
                        </Tag>
                      )}
                      {!isValid && (
                        <Tag type="red" size="sm" renderIcon={WarningAlt}>
                          Invalid
                        </Tag>
                      )}
                      {isValid && Object.keys(config).length > 0 && (
                        <Tag type="green" size="sm" renderIcon={Checkmark}>
                          Configured
                        </Tag>
                      )}
                    </div>
                  </div>

                  {/* Component Description */}
                  {component.description && (
                    <div className="component-config-section__component-description">
                      <Information size={16} />
                      <span><strong>{component.name}:</strong> {component.description}</span>
                    </div>
                  )}

                  {/* Configuration Form */}
                  {schema ? (
                    <ConfigurationForm
                      sections={schema.sections}
                      values={config}
                      isRequired={component.required}
                      onChange={(fieldName: string, value: any) => {
                        // CRITICAL: Pass originalName to match cartridge name
                        // Handle nested fields (installation_options, license_service, etc.)
                        const updatedConfig = { ...config };
                        
                        // Find which section this field belongs to
                        let sectionId: string | null = null;
                        for (const section of schema.sections) {
                          if (section.fields.some(f => f.name === fieldName)) {
                            sectionId = section.id;
                            break;
                          }
                        }
                        
                        // Determine if this field should be nested
                        const nestedSections = ['installation_options', 'advanced', 'features', 'license_service'];
                        const shouldNest = sectionId && nestedSections.includes(sectionId);
                        
                        if (shouldNest && sectionId) {
                          // Nest under the section id (e.g., installation_options, license_service)
                          updatedConfig[sectionId] = {
                            ...(config[sectionId] || {}),
                            [fieldName]: value
                          };
                        } else {
                          // Top-level field (basic section fields like state, size, etc.)
                          updatedConfig[fieldName] = value;
                        }
                        
                        handleConfigChange(component.originalName, updatedConfig);
                      }}
                      onValidate={(results) => {
                        const isValid = results.every(r => r.valid);
                        handleValidationChange(component.id, isValid);
                      }}
                      showValidation={true}
                    />
                  ) : (
                    <InlineNotification
                      kind="info"
                      title="No configuration required"
                      subtitle="This component uses default settings and does not require additional configuration."
                      hideCloseButton
                    />
                  )}

                  {/* Model Configuration Section (for components that support models) */}
                  {schema?.supportsModels && component.originalName === 'watsonx_ai' && (
                    <ModelConfigurationSection
                      availableModels={WATSONX_AI_MODELS}
                      selectedModels={config.models || []}
                      onChange={(models) => {
                        handleConfigChange(component.originalName, { ...config, models });
                      }}
                    />
                  )}
                </div>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* Validation Summary */}
      {!overallValid && (
        <div className="component-config-section__validation-summary">
          <InlineNotification
            kind="error"
            title="Configuration validation failed"
            subtitle="Please review and fix the errors in the components marked as invalid above."
            hideCloseButton
          />
        </div>
      )}
    </div>
  );
};

// Made with Bob