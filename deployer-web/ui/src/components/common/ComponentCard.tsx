/**
 * Component Card
 * Displays a Cloud Pak component with selection controls and dependency info
 */

import React from 'react';
import { Tile, Checkbox, Button, Tag } from '@carbon/react';
import { Information, CheckmarkFilled } from '@carbon/icons-react';
import { Component } from '@/types';
import './ComponentCard.css';

interface ComponentCardProps {
  component: Component;
  isSelected: boolean;
  isAutoSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
  onShowInfo: () => void;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({
  component,
  isSelected,
  isAutoSelected,
  onSelect,
  onDeselect,
  onShowInfo
}) => {
  const handleCheckboxChange = () => {
    if (isAutoSelected) {
      return; // Cannot toggle auto-selected components
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
      }`}
    >
      <div className="component-card__header">
        <div className="component-card__title-section">
          <h4 className="component-card__title">{component.name}</h4>
          {isSelected && (
            <CheckmarkFilled className="component-card__check-icon" size={20} />
          )}
        </div>
        <div className="component-card__tags">
          {isAutoSelected && (
            <Tag type="blue" size="sm">
              Auto-selected
            </Tag>
          )}
          {component.category && (
            <Tag type="gray" size="sm">
              {component.category}
            </Tag>
          )}
        </div>
      </div>

      <p className="component-card__description">{component.description}</p>

      {component.restrictions.length > 0 && (
        <div className="component-card__restrictions">
          <Tag type="red" size="sm">
            Has restrictions
          </Tag>
        </div>
      )}

      <div className="component-card__footer">
        <Checkbox
          id={`select-${component.id}`}
          labelText="Select"
          checked={isSelected}
          onChange={handleCheckboxChange}
          disabled={isAutoSelected}
        />
        <Button
          kind="ghost"
          size="sm"
          renderIcon={Information}
          onClick={onShowInfo}
          iconDescription="View dependencies"
        >
          Dependencies
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
