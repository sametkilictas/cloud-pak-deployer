/**
 * Component Card
 * Displays a Cloud Pak component with selection controls and dependency info
 * Enhanced with status indicators, dependency badges, and external requirements
 */

import React from 'react';
import { Tile, Checkbox, Button, Tag, Tooltip } from '@carbon/react';
import {
  Information,
  CheckmarkFilled,
  WarningAlt,
  Locked,
  Network_3,
  DataBase,
  Misuse
} from '@carbon/icons-react';
import { Component } from '@/types';
import './ComponentCard.css';

interface ComponentCardProps {
  component: Component;
  isSelected: boolean;
  isAutoSelected: boolean;
  isConflicted?: boolean;
  dependencyCount?: number;
  externalDependencyCount?: number;
  onSelect: () => void;
  onDeselect: () => void;
  onShowInfo: () => void;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({
  component,
  isSelected,
  isAutoSelected,
  isConflicted = false,
  dependencyCount = 0,
  externalDependencyCount = 0,
  onSelect,
  onDeselect,
  onShowInfo
}) => {
  const isDisabled = component.disabled || false;

  const handleCheckboxChange = () => {
    if (isAutoSelected || isDisabled) {
      return; // Cannot toggle auto-selected or disabled components
    }
    if (isSelected) {
      onDeselect();
    } else {
      onSelect();
    }
  };

  return (
    <Tile
      className={`component-card ${isSelected ? 'selected' : ''} ${
        isAutoSelected ? 'auto-selected' : ''
      } ${isConflicted ? 'conflicted' : ''} ${isDisabled ? 'disabled' : ''}`}
    >
      {/* Status Indicator Bar */}
      {(isSelected || isAutoSelected || isConflicted || isDisabled) && (
        <div className={`component-card__status-bar ${
          isConflicted ? 'status-bar--error' :
          isDisabled ? 'status-bar--disabled' :
          isAutoSelected ? 'status-bar--info' :
          'status-bar--success'
        }`} />
      )}

      <div className="component-card__header">
        <div className="component-card__title-section">
          <h4 className="component-card__title">{component.name}</h4>
          {isSelected && !isConflicted && !isDisabled && (
            <CheckmarkFilled className="component-card__check-icon" size={20} />
          )}
          {isConflicted && (
            <WarningAlt className="component-card__warning-icon" size={20} />
          )}
          {isAutoSelected && (
            <Locked className="component-card__lock-icon" size={16} />
          )}
          {isDisabled && (
            <Tooltip align="top" label={component.disabledReason || 'Not available'}>
              <Misuse className="component-card__disabled-icon" size={20} />
            </Tooltip>
          )}
        </div>
        <div className="component-card__tags">
          {isDisabled && (
            <Tag type="gray" size="sm">
              Not Available
            </Tag>
          )}
          {isAutoSelected && !isDisabled && (
            <Tag type="blue" size="sm">
              Auto-selected
            </Tag>
          )}
          {isConflicted && (
            <Tag type="red" size="sm">
              Conflict
            </Tag>
          )}
          {component.category && !isDisabled && (
            <Tag type="gray" size="sm">
              {component.category}
            </Tag>
          )}
        </div>
      </div>

      <p className="component-card__description">{component.description}</p>

      {/* Dependency Indicators */}
      {(dependencyCount > 0 || externalDependencyCount > 0 || component.restrictions.length > 0) && (
        <div className="component-card__indicators">
          {dependencyCount > 0 && (
            <div className="component-card__indicator">
              <Network_3 size={16} />
              <span className="component-card__indicator-text">
                {dependencyCount} {dependencyCount === 1 ? 'dependency' : 'dependencies'}
              </span>
            </div>
          )}
          {externalDependencyCount > 0 && (
            <div className="component-card__indicator">
              <DataBase size={16} />
              <span className="component-card__indicator-text">
                {externalDependencyCount} external {externalDependencyCount === 1 ? 'requirement' : 'requirements'}
              </span>
            </div>
          )}
          {component.restrictions.length > 0 && (
            <div className="component-card__indicator component-card__indicator--warning">
              <WarningAlt size={16} />
              <span className="component-card__indicator-text">
                {component.restrictions.length} {component.restrictions.length === 1 ? 'restriction' : 'restrictions'}
              </span>
            </div>
          )}
        </div>
      )}

      {isDisabled && component.disabledReason && (
        <div className="component-card__disabled-message">
          <Misuse size={16} />
          <span>{component.disabledReason}</span>
        </div>
      )}

      <div className="component-card__footer">
        <Checkbox
          id={`select-${component.id}`}
          labelText="Select"
          checked={isSelected}
          onChange={handleCheckboxChange}
          disabled={isAutoSelected || isDisabled}
        />
        <Button
          kind="ghost"
          size="sm"
          renderIcon={Information}
          onClick={onShowInfo}
          iconDescription="View dependencies"
          disabled={isDisabled}
        >
          Details
        </Button>
      </div>

      {component.version && (
        <div className="component-card__version">
          <span className="component-card__version-label">Version:</span>
          <span className="component-card__version-value">{component.version}</span>
        </div>
      )}
    </Tile>
  );
};

// Made with Bob
