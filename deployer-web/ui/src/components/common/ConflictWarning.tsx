/**
 * Conflict Warning Component
 * 
 * Displays conflicts detected during dependency resolution with severity indicators.
 * Shows affected components and provides actionable information to resolve conflicts.
 * 
 * Features:
 * - Severity-based styling (error, warning)
 * - Expandable conflict details
 * - Affected component list
 * - Resolution suggestions
 * - Inline notifications using Carbon Design System
 */

import React, { useState } from 'react';
import { 
  InlineNotification, 
  Button,
  Tag,
  Accordion,
  AccordionItem
} from '@carbon/react';
import { 
  WarningAlt, 
  ErrorFilled,
  ChevronDown,
  ChevronUp
} from '@carbon/icons-react';
import { Conflict } from '../../types/component.types';
import './ConflictWarning.css';

interface ConflictWarningProps {
  conflicts: Conflict[];
  onResolve?: (conflict: Conflict) => void;
  className?: string;
}

interface GroupedConflicts {
  errors: Conflict[];
  warnings: Conflict[];
}

export const ConflictWarning: React.FC<ConflictWarningProps> = ({
  conflicts,
  onResolve,
  className = ''
}) => {
  const [expandedConflicts, setExpandedConflicts] = useState<Set<number>>(new Set());

  // Group conflicts by severity
  const groupedConflicts: GroupedConflicts = conflicts.reduce(
    (acc, conflict) => {
      if (conflict.severity === 'error') {
        acc.errors.push(conflict);
      } else {
        acc.warnings.push(conflict);
      }
      return acc;
    },
    { errors: [], warnings: [] } as GroupedConflicts
  );

  const toggleConflict = (index: number) => {
    const newExpanded = new Set(expandedConflicts);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedConflicts(newExpanded);
  };

  const getConflictIcon = (severity: 'error' | 'warning') => {
    return severity === 'error' ? ErrorFilled : WarningAlt;
  };

  const getConflictTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'incompatible': 'Incompatible Components',
      'missing_dependency': 'Missing Dependency',
      'version_mismatch': 'Version Mismatch',
      'restriction': 'Restriction Violation'
    };
    return labels[type] || type;
  };

  const getResolutionSuggestion = (conflict: Conflict): string => {
    switch (conflict.type) {
      case 'incompatible':
        return 'Deselect one of the conflicting components to proceed.';
      case 'missing_dependency':
        return 'Select the required dependency or deselect the component.';
      case 'version_mismatch':
        return 'Ensure all components are compatible with the selected platform version.';
      case 'restriction_violation':
        return 'Review component restrictions and adjust your selection.';
      default:
        return 'Review the conflict details and adjust your selection.';
    }
  };

  const renderConflictList = (conflictList: Conflict[], severity: 'error' | 'warning') => {
    if (conflictList.length === 0) return null;

    return (
      <div className={`conflict-warning__section conflict-warning__section--${severity}`}>
        <div className="conflict-warning__section-header">
          <div className="conflict-warning__section-title">
            {React.createElement(getConflictIcon(severity), { size: 20 })}
            <h4>
              {severity === 'error' ? 'Errors' : 'Warnings'} ({conflictList.length})
            </h4>
          </div>
        </div>

        <div className="conflict-warning__list">
          {conflictList.map((conflict, index) => {
            const globalIndex = severity === 'error' 
              ? index 
              : groupedConflicts.errors.length + index;
            const isExpanded = expandedConflicts.has(globalIndex);

            return (
              <div key={globalIndex} className="conflict-warning__item">
                <InlineNotification
                  kind={severity === 'error' ? 'error' : 'warning'}
                  title={getConflictTypeLabel(conflict.type)}
                  subtitle={conflict.message}
                  lowContrast
                  hideCloseButton
                  className="conflict-warning__notification"
                />

                <div className="conflict-warning__details">
                  <Button
                    kind="ghost"
                    size="sm"
                    renderIcon={isExpanded ? ChevronUp : ChevronDown}
                    onClick={() => toggleConflict(globalIndex)}
                  >
                    {isExpanded ? 'Hide' : 'Show'} Details
                  </Button>

                  {isExpanded && (
                    <div className="conflict-warning__expanded">
                      <div className="conflict-warning__affected">
                        <h5>Affected Components:</h5>
                        <div className="conflict-warning__component-list">
                          {conflict.components.map((componentId) => (
                            <Tag key={componentId} type="red" size="sm">
                              {componentId}
                            </Tag>
                          ))}
                        </div>
                      </div>

                      <div className="conflict-warning__suggestion">
                        <h5>Resolution Suggestion:</h5>
                        <p>{getResolutionSuggestion(conflict)}</p>
                      </div>

                      {onResolve && (
                        <div className="conflict-warning__actions">
                          <Button
                            kind="tertiary"
                            size="sm"
                            onClick={() => onResolve(conflict)}
                          >
                            Auto-Resolve
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (conflicts.length === 0) {
    return null;
  }

  return (
    <div className={`conflict-warning ${className}`}>
      <div className="conflict-warning__header">
        <h3 className="conflict-warning__title">
          Dependency Conflicts Detected
        </h3>
        <div className="conflict-warning__summary">
          {groupedConflicts.errors.length > 0 && (
            <Tag type="red" size="md">
              {groupedConflicts.errors.length} Error{groupedConflicts.errors.length !== 1 ? 's' : ''}
            </Tag>
          )}
          {groupedConflicts.warnings.length > 0 && (
            <Tag type="warm-gray" size="md">
              {groupedConflicts.warnings.length} Warning{groupedConflicts.warnings.length !== 1 ? 's' : ''}
            </Tag>
          )}
        </div>
      </div>

      {renderConflictList(groupedConflicts.errors, 'error')}
      {renderConflictList(groupedConflicts.warnings, 'warning')}

      {groupedConflicts.errors.length > 0 && (
        <div className="conflict-warning__footer">
          <InlineNotification
            kind="info"
            title="Action Required"
            subtitle="Please resolve all errors before proceeding with deployment."
            lowContrast
            hideCloseButton
          />
        </div>
      )}
    </div>
  );
};

export default ConflictWarning;

// Made with Bob