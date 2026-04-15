/**
 * YAMLPreview Component
 * 
 * Displays YAML configuration with syntax highlighting, error indicators,
 * and action buttons for copy/download functionality.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Button,
  InlineNotification,
  SkeletonText,
  Tag,
  Tooltip
} from '@carbon/react';
import {
  Copy,
  Download,
  CheckmarkFilled,
  WarningAlt,
  ErrorFilled,
  Information
} from '@carbon/icons-react';
import { useThemeStore } from '../../stores/themeStore';
import { YAMLPreviewProps, ValidationError } from '../../types/configuration.types';
import './YAMLPreview.css';

interface YAMLPreviewComponentProps extends YAMLPreviewProps {
  isLoading?: boolean;
  lineNumbers?: boolean;
  maxHeight?: string;
}

export const YAMLPreview: React.FC<YAMLPreviewComponentProps> = ({
  yaml,
  errors = [],
  onCopy,
  onDownload,
  highlightErrors = true,
  isLoading = false,
  lineNumbers = true,
  maxHeight = '70vh'
}) => {
  const { theme } = useThemeStore();
  const [copied, setCopied] = useState(false);
  const [showErrors, setShowErrors] = useState(true);

  // Select syntax highlighting theme based on Carbon theme
  const syntaxTheme = theme === 'dark' ? vscDarkPlus : vs;

  // Group errors by line number
  const errorsByLine = useMemo(() => {
    const grouped = new Map<number, ValidationError[]>();
    errors.forEach(error => {
      const lineMatch = error.field.match(/line:(\d+)/);
      if (lineMatch) {
        const line = parseInt(lineMatch[1], 10);
        if (!grouped.has(line)) {
          grouped.set(line, []);
        }
        grouped.get(line)!.push(error);
      }
    });
    return grouped;
  }, [errors]);

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(yaml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.();
    } catch (err) {
      console.error('Failed to copy YAML:', err);
    }
  }, [yaml, onCopy]);

  // Handle download
  const handleDownload = useCallback(() => {
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `config-${new Date().toISOString().split('T')[0]}.yaml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onDownload?.();
  }, [yaml, onDownload]);

  // Calculate YAML statistics
  const stats = useMemo(() => {
    const lines = yaml.split('\n').length;
    const chars = yaml.length;
    const components = (yaml.match(/- name:/g) || []).length;
    return { lines, chars, components };
  }, [yaml]);

  if (isLoading) {
    return (
      <div className="yaml-preview yaml-preview--loading">
        <div className="yaml-preview__header">
          <h3 className="yaml-preview__title">Configuration Preview</h3>
        </div>
        <div className="yaml-preview__content">
          <SkeletonText paragraph lineCount={20} />
        </div>
      </div>
    );
  }

  return (
    <div className="yaml-preview">
      {/* Header with actions */}
      <div className="yaml-preview__header">
        <div className="yaml-preview__title-section">
          <h3 className="yaml-preview__title">Configuration Preview</h3>
          <div className="yaml-preview__stats">
            <Tag size="sm" type="gray">
              {stats.lines} lines
            </Tag>
            <Tag size="sm" type="gray">
              {stats.components} components
            </Tag>
            {errors.length > 0 && (
              <Tag size="sm" type="red">
                {errors.length} {errors.length === 1 ? 'error' : 'errors'}
              </Tag>
            )}
          </div>
        </div>
        
        <div className="yaml-preview__actions">
          <Button
            kind="ghost"
            size="sm"
            renderIcon={copied ? CheckmarkFilled : Copy}
            iconDescription={copied ? 'Copied!' : 'Copy to clipboard'}
            hasIconOnly
            onClick={handleCopy}
            disabled={!yaml}
          />
          <Button
            kind="ghost"
            size="sm"
            renderIcon={Download}
            iconDescription="Download YAML"
            hasIconOnly
            onClick={handleDownload}
            disabled={!yaml}
          />
        </div>
      </div>

      {/* Error notifications */}
      {errors.length > 0 && showErrors && (
        <div className="yaml-preview__errors">
          <InlineNotification
            kind="error"
            title="Configuration Errors"
            subtitle={`Found ${errors.length} ${errors.length === 1 ? 'error' : 'errors'} in the configuration`}
            lowContrast
            hideCloseButton={false}
            onCloseButtonClick={() => setShowErrors(false)}
          />
        </div>
      )}

      {/* YAML content with syntax highlighting */}
      <div 
        className="yaml-preview__content"
        style={{ maxHeight }}
      >
        {yaml ? (
          <div className="yaml-preview__code-wrapper">
            <SyntaxHighlighter
              language="yaml"
              style={syntaxTheme}
              showLineNumbers={lineNumbers}
              wrapLines={highlightErrors && errorsByLine.size > 0}
              lineProps={(lineNumber) => {
                const hasError = errorsByLine.has(lineNumber);
                return {
                  style: {
                    backgroundColor: hasError ? 'rgba(218, 30, 40, 0.1)' : undefined,
                    display: 'block',
                    width: '100%'
                  },
                  className: hasError ? 'yaml-preview__line--error' : undefined
                };
              }}
              customStyle={{
                margin: 0,
                padding: '1rem',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                backgroundColor: theme === 'dark' ? '#262626' : '#f4f4f4'
              }}
            >
              {yaml}
            </SyntaxHighlighter>

            {/* Error indicators in the gutter */}
            {highlightErrors && errorsByLine.size > 0 && (
              <div className="yaml-preview__error-indicators">
                {Array.from(errorsByLine.entries()).map(([line, lineErrors]) => (
                  <Tooltip
                    key={line}
                    align="right"
                    label={lineErrors.map(e => e.message).join(', ')}
                  >
                    <div
                      className="yaml-preview__error-indicator"
                      style={{ top: `${(line - 1) * 1.5 + 1}rem` }}
                    >
                      <ErrorFilled size={16} />
                    </div>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="yaml-preview__empty">
            <WarningAlt size={32} />
            <p>No configuration to preview</p>
            <p className="yaml-preview__empty-hint">
              Select components and configure settings to generate YAML
            </p>
          </div>
        )}
      </div>

      {/* Footer with helpful information */}
      {yaml && (
        <div className="yaml-preview__footer">
          <div className="yaml-preview__footer-info">
            <span className="yaml-preview__footer-label">Format:</span>
            <span className="yaml-preview__footer-value">YAML</span>
          </div>
          <div className="yaml-preview__footer-info">
            <span className="yaml-preview__footer-label">Size:</span>
            <span className="yaml-preview__footer-value">
              {(stats.chars / 1024).toFixed(2)} KB
            </span>
          </div>
          <div className="yaml-preview__footer-info">
            <span className="yaml-preview__footer-label">Encoding:</span>
            <span className="yaml-preview__footer-value">UTF-8</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default YAMLPreview;

// Made with Bob
