/**
 * ConfigurationForm Component
 * 
 * Dynamically generates form fields based on component schemas.
 * Handles validation, state management, and user input for component configuration.
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  TextInput,
  NumberInput,
  Toggle,
  Select,
  SelectItem,
  MultiSelect,
  TextArea,
  FormGroup,
  FormLabel,
  Accordion,
  AccordionItem,
  InlineNotification,
  Button
} from '@carbon/react';
import { Information, WarningAlt } from '@carbon/icons-react';
import {
  FormFieldSchema,
  FormSectionSchema,
  FieldValidationResult
} from '../../types/configuration.types';
import { validateField } from '../../schemas/componentSchemas';
import './ConfigurationForm.css';

interface ConfigurationFormProps {
  sections: FormSectionSchema[];
  values: Record<string, any>;
  onChange: (fieldName: string, value: any) => void;
  onValidate?: (results: FieldValidationResult[]) => void;
  errors?: Record<string, string[]>;
  disabled?: boolean;
  showValidation?: boolean;
}

export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  sections,
  values,
  onChange,
  onValidate,
  errors = {},
  disabled = false,
  showValidation = true
}) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  // Mark field as touched
  const handleBlur = useCallback((fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  // Validate a single field
  const validateSingleField = useCallback((field: FormFieldSchema, value: any): string | undefined => {
    const result = validateField(field, value);
    return result.valid ? undefined : result.error;
  }, []);

  // Handle field change with validation
  const handleFieldChange = useCallback((field: FormFieldSchema, value: any) => {
    onChange(field.name, value);
    
    // Validate if field has been touched
    if (touched[field.name] && showValidation) {
      const error = validateSingleField(field, value);
      setLocalErrors(prev => ({
        ...prev,
        [field.name]: error || ''
      }));
    }
  }, [onChange, touched, showValidation, validateSingleField]);

  // Get error message for a field
  const getFieldError = useCallback((fieldName: string): string | undefined => {
    // Check local errors first
    if (localErrors[fieldName]) {
      return localErrors[fieldName];
    }
    // Check prop errors
    if (errors[fieldName] && errors[fieldName].length > 0) {
      return errors[fieldName][0];
    }
    return undefined;
  }, [localErrors, errors]);

  // Check if field should be shown based on conditional display
  const shouldShowField = useCallback((field: FormFieldSchema): boolean => {
    if (!field.showWhen) return true;
    const conditionValue = values[field.showWhen.field];
    return conditionValue === field.showWhen.value;
  }, [values]);

  // Render a single form field based on its type
  const renderField = useCallback((field: FormFieldSchema) => {
    if (!shouldShowField(field)) return null;
    if (field.hidden) return null;

    const value = values[field.name] ?? field.defaultValue;
    const error = getFieldError(field.name);
    const isInvalid = showValidation && touched[field.name] && !!error;
    const isDisabled = disabled || field.disabled;

    const commonProps = {
      id: field.name,
      labelText: field.label,
      helperText: field.helpText,
      disabled: isDisabled,
      invalid: isInvalid,
      invalidText: error,
      onBlur: () => handleBlur(field.name)
    };

    switch (field.type) {
      case 'text':
      case 'password':
        return (
          <TextInput
            {...commonProps}
            type={field.type}
            value={value || ''}
            placeholder={field.placeholder}
            onChange={(e) => handleFieldChange(field, e.target.value)}
          />
        );

      case 'number':
        return (
          <NumberInput
            {...commonProps}
            value={value ?? field.defaultValue ?? 0}
            min={field.min}
            max={field.max}
            step={1}
            onChange={(e, { value: newValue }) => handleFieldChange(field, newValue)}
            label={field.unit ? `${field.label} (${field.unit})` : field.label}
          />
        );

      case 'boolean':
        return (
          <Toggle
            id={field.name}
            labelText={field.label}
            labelA="Off"
            labelB="On"
            toggled={value ?? field.defaultValue ?? false}
            disabled={isDisabled}
            onToggle={(checked) => handleFieldChange(field, checked)}
          />
        );

      case 'select':
        return (
          <Select
            {...commonProps}
            value={value ?? field.defaultValue ?? ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
          >
            <SelectItem value="" text="Select an option" />
            {field.options?.map(option => (
              <SelectItem
                key={option.value}
                value={option.value}
                text={option.label}
              />
            ))}
          </Select>
        );

      case 'multiselect':
        return (
          <MultiSelect
            id={field.name}
            titleText={field.label}
            label={field.placeholder || 'Select options'}
            items={field.options?.map(opt => ({
              id: opt.value.toString(),
              label: opt.label
            })) || []}
            initialSelectedItems={
              Array.isArray(value)
                ? value.map(v => ({ id: v.toString(), label: v.toString() }))
                : []
            }
            disabled={isDisabled}
            invalid={isInvalid}
            invalidText={error}
            onChange={({ selectedItems }) => {
              const values = selectedItems ? selectedItems.map(item => item.id) : [];
              handleFieldChange(field, values);
            }}
          />
        );

      case 'textarea':
        return (
          <TextArea
            {...commonProps}
            value={value || ''}
            placeholder={field.placeholder}
            rows={4}
            onChange={(e) => handleFieldChange(field, e.target.value)}
          />
        );

      case 'array':
        // For array fields, use multiselect if options are provided, otherwise textarea
        if (field.options && field.options.length > 0) {
          return (
            <MultiSelect
              id={field.name}
              titleText={field.label}
              label={field.placeholder || 'Select items'}
              items={field.options.map(opt => ({
                id: opt.value.toString(),
                label: opt.label
              }))}
              initialSelectedItems={
                Array.isArray(value)
                  ? value.map(v => ({ id: v.toString(), label: v.toString() }))
                  : []
              }
              disabled={isDisabled}
              invalid={isInvalid}
              invalidText={error}
              onChange={({ selectedItems }) => {
                const values = selectedItems ? selectedItems.map(item => item.id) : [];
                handleFieldChange(field, values);
              }}
            />
          );
        } else {
          // For arrays without options, use textarea with comma-separated values
          const arrayValue = Array.isArray(value) ? value.join(', ') : '';
          return (
            <TextArea
              {...commonProps}
              value={arrayValue}
              placeholder={field.placeholder || 'Enter comma-separated values'}
              rows={3}
              onChange={(e) => {
                const newValue = e.target.value
                  .split(',')
                  .map(v => v.trim())
                  .filter(v => v.length > 0);
                handleFieldChange(field, newValue);
              }}
            />
          );
        }

      default:
        return (
          <TextInput
            {...commonProps}
            value={value || ''}
            placeholder={field.placeholder}
            onChange={(e) => handleFieldChange(field, e.target.value)}
          />
        );
    }
  }, [
    values,
    touched,
    disabled,
    showValidation,
    shouldShowField,
    getFieldError,
    handleBlur,
    handleFieldChange
  ]);

  // Render a section of fields
  const renderSection = useCallback((section: FormSectionSchema) => {
    const visibleFields = section.fields.filter(shouldShowField);
    if (visibleFields.length === 0) return null;

    const sectionContent = (
      <span className="config-form__section-content">
        {section.description && (
          <span className="config-form__section-description">{section.description}</span>
        )}
        <span className="config-form__fields">
          {section.fields.map(field => (
            <span key={field.name} className="config-form__field">
              {renderField(field)}
            </span>
          ))}
        </span>
      </span>
    );

    // If section is collapsible, wrap in accordion
    if (section.collapsible) {
      return (
        <Accordion key={section.id}>
          <AccordionItem
            title={section.title}
            open={!section.defaultCollapsed}
          >
            {sectionContent}
          </AccordionItem>
        </Accordion>
      );
    }

    // Otherwise, render as a regular section
    return (
      <span key={section.id} className="config-form__section">
        <span className="config-form__section-title">{section.title}</span>
        {sectionContent}
      </span>
    );
  }, [shouldShowField, renderField]);

  // Validate all fields and report results
  const validateAll = useCallback(() => {
    const results: FieldValidationResult[] = [];
    const newErrors: Record<string, string> = {};

    sections.forEach(section => {
      section.fields.forEach(field => {
        if (!shouldShowField(field)) return;
        
        const value = values[field.name] ?? field.defaultValue;
        const error = validateSingleField(field, value);
        
        results.push({
          field: field.name,
          valid: !error,
          errors: error ? [error] : [],
          warnings: []
        });

        if (error) {
          newErrors[field.name] = error;
        }
      });
    });

    setLocalErrors(newErrors);
    onValidate?.(results);
    
    return results.every(r => r.valid);
  }, [sections, values, shouldShowField, validateSingleField, onValidate]);

  // Count total errors
  const errorCount = useMemo(() => {
    return Object.keys(localErrors).filter(key => localErrors[key]).length +
           Object.keys(errors).reduce((sum, key) => sum + errors[key].length, 0);
  }, [localErrors, errors]);

  return (
    <span className="config-form">
      {/* Error summary */}
      {showValidation && errorCount > 0 && (
        <span className="config-form__error-summary">
          <InlineNotification
            kind="error"
            title="Validation Errors"
            subtitle={`Please fix ${errorCount} ${errorCount === 1 ? 'error' : 'errors'} before proceeding`}
            lowContrast
            hideCloseButton
          />
        </span>
      )}

      {/* Form sections */}
      <span className="config-form__sections">
        {sections.map(renderSection)}
      </span>

      {/* Validation button (optional) */}
      {showValidation && (
        <span className="config-form__actions">
          <Button
            kind="tertiary"
            size="sm"
            onClick={validateAll}
            disabled={disabled}
          >
            Validate Configuration
          </Button>
        </span>
      )}
    </span>
  );
};

export default ConfigurationForm;

// Made with Bob
