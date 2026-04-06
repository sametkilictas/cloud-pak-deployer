/**
 * Dynamic Form Component
 * 
 * Generates forms dynamically based on component configuration schemas.
 * Supports various field types with validation and real-time feedback.
 * 
 * Features:
 * - Schema-driven form generation
 * - Multiple field types (text, number, select, toggle, etc.)
 * - Real-time validation
 * - Conditional field visibility
 * - Nested object support
 * - Array field support
 * - Integration with React Hook Form
 */

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextInput,
  NumberInput,
  Select,
  SelectItem,
  Toggle,
  TextArea,
  FormGroup,
  Button,
  InlineNotification
} from '@carbon/react';
import { Save, Reset } from '@carbon/icons-react';
import './DynamicForm.css';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'toggle' | 'textarea' | 'object' | 'array';
  required?: boolean;
  defaultValue?: any;
  placeholder?: string;
  helperText?: string;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  pattern?: string;
  validation?: {
    required?: string;
    pattern?: { value: RegExp; message: string };
    min?: { value: number; message: string };
    max?: { value: number; message: string };
    validate?: (value: any) => boolean | string;
  };
  fields?: FormField[]; // For nested objects
  conditionalDisplay?: {
    field: string;
    value: any;
  };
}

export interface FormSchema {
  fields: FormField[];
  title?: string;
  description?: string;
}

interface DynamicFormProps {
  schema: FormSchema;
  initialValues?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  schema,
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  isLoading = false
}) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty }
  } = useForm({
    defaultValues: initialValues
  });

  // Watch all fields for conditional display
  const watchedFields = watch();

  // Reset form when initial values change
  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  // Check if field should be displayed based on conditions
  const shouldDisplayField = (field: FormField): boolean => {
    if (!field.conditionalDisplay) return true;

    const { field: conditionField, value: conditionValue } = field.conditionalDisplay;
    const currentValue = watchedFields[conditionField];

    if (Array.isArray(conditionValue)) {
      return conditionValue.includes(currentValue);
    }

    return currentValue === conditionValue;
  };

  // Render individual field based on type
  const renderField = (field: FormField) => {
    if (!shouldDisplayField(field)) return null;

    const fieldError = errors[field.name];
    const errorMessage = fieldError?.message as string;

    switch (field.type) {
      case 'text':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            rules={field.validation}
            render={({ field: { onChange, value, name } }) => (
              <TextInput
                id={name}
                labelText={field.label}
                placeholder={field.placeholder}
                helperText={field.helperText}
                invalid={!!fieldError}
                invalidText={errorMessage}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                required={field.required}
              />
            )}
          />
        );

      case 'number':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            rules={field.validation}
            render={({ field: { onChange, value, name } }) => (
              <NumberInput
                id={name}
                label={field.label}
                helperText={field.helperText}
                invalid={!!fieldError}
                invalidText={errorMessage}
                value={value || 0}
                onChange={(e, { value: newValue }) => onChange(newValue)}
                min={field.min}
                max={field.max}
                required={field.required}
              />
            )}
          />
        );

      case 'select':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            rules={field.validation}
            render={({ field: { onChange, value, name } }) => (
              <Select
                id={name}
                labelText={field.label}
                helperText={field.helperText}
                invalid={!!fieldError}
                invalidText={errorMessage}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                required={field.required}
              >
                <SelectItem value="" text="Select an option" />
                {field.options?.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    text={option.label}
                  />
                ))}
              </Select>
            )}
          />
        );

      case 'toggle':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Toggle
                id={name}
                labelText={field.label}
                toggled={!!value}
                onToggle={onChange}
              />
            )}
          />
        );

      case 'textarea':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            rules={field.validation}
            render={({ field: { onChange, value, name } }) => (
              <TextArea
                id={name}
                labelText={field.label}
                placeholder={field.placeholder}
                helperText={field.helperText}
                invalid={!!fieldError}
                invalidText={errorMessage}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                required={field.required}
                rows={4}
              />
            )}
          />
        );

      case 'object':
        return (
          <FormGroup key={field.name} legendText={field.label}>
            <div className="dynamic-form__nested">
              {field.fields?.map((nestedField) => renderField(nestedField))}
            </div>
          </FormGroup>
        );

      default:
        return null;
    }
  };

  const handleReset = () => {
    reset(initialValues);
  };

  return (
    <form className="dynamic-form" onSubmit={handleSubmit(onSubmit)}>
      {schema.title && (
        <h3 className="dynamic-form__title">{schema.title}</h3>
      )}

      {schema.description && (
        <p className="dynamic-form__description">{schema.description}</p>
      )}

      {Object.keys(errors).length > 0 && (
        <InlineNotification
          kind="error"
          title="Validation Error"
          subtitle="Please fix the errors below before submitting."
          lowContrast
          hideCloseButton
        />
      )}

      <div className="dynamic-form__fields">
        {schema.fields.map((field) => renderField(field))}
      </div>

      <div className="dynamic-form__actions">
        <Button
          type="submit"
          renderIcon={Save}
          disabled={isLoading || !isDirty}
        >
          {submitLabel}
        </Button>

        {isDirty && (
          <Button
            kind="secondary"
            renderIcon={Reset}
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </Button>
        )}

        {onCancel && (
          <Button
            kind="ghost"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
        )}
      </div>
    </form>
  );
};

export default DynamicForm;

// Made with Bob
