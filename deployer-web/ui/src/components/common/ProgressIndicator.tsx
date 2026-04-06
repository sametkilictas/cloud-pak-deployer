/**
 * Progress Indicator Component
 * 
 * Displays deployment progress with stage-based indicators.
 * Shows current stage, completed stages, and overall progress.
 * 
 * Features:
 * - Multi-stage progress visualization
 * - Current stage highlighting
 * - Completion status indicators
 * - Estimated time remaining
 * - Error state handling
 */

import React from 'react';
import { ProgressIndicator as CarbonProgressIndicator, ProgressStep } from '@carbon/react';
import { Checkmark, Error, InProgress } from '@carbon/icons-react';
import './ProgressIndicator.css';

export interface DeploymentStage {
  id: string;
  label: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'complete' | 'error';
  startTime?: string;
  endTime?: string;
}

interface ProgressIndicatorProps {
  stages: DeploymentStage[];
  currentStageIndex: number;
  overallProgress: number;
  estimatedTimeRemaining?: string;
  onStageClick?: (stageId: string) => void;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  stages,
  currentStageIndex,
  overallProgress,
  estimatedTimeRemaining,
  onStageClick
}) => {
  const getStageIcon = (status: DeploymentStage['status']) => {
    switch (status) {
      case 'complete':
        return <Checkmark size={16} className="progress-indicator__icon--complete" />;
      case 'error':
        return <Error size={16} className="progress-indicator__icon--error" />;
      case 'in-progress':
        return <InProgress size={16} className="progress-indicator__icon--in-progress" />;
      default:
        return null;
    }
  };

  const getStageStatus = (index: number, stage: DeploymentStage) => {
    if (stage.status === 'error') return 'invalid';
    if (stage.status === 'complete') return 'complete';
    if (index === currentStageIndex) return 'current';
    return 'incomplete';
  };

  return (
    <div className="progress-indicator">
      <div className="progress-indicator__header">
        <h3 className="progress-indicator__title">Deployment Progress</h3>
        <div className="progress-indicator__stats">
          <span className="progress-indicator__percentage">{overallProgress}%</span>
          {estimatedTimeRemaining && (
            <span className="progress-indicator__time">
              Est. {estimatedTimeRemaining} remaining
            </span>
          )}
        </div>
      </div>

      <div className="progress-indicator__bar">
        <div
          className="progress-indicator__bar-fill"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      <CarbonProgressIndicator
        currentIndex={currentStageIndex}
        spaceEqually
        className="progress-indicator__stages"
      >
        {stages.map((stage, index) => (
          <ProgressStep
            key={stage.id}
            label={stage.label}
            description={stage.description}
            secondaryLabel={
              stage.status === 'complete' && stage.endTime
                ? `Completed at ${stage.endTime}`
                : stage.status === 'in-progress' && stage.startTime
                ? `Started at ${stage.startTime}`
                : undefined
            }
            invalid={stage.status === 'error'}
            complete={stage.status === 'complete'}
            current={index === currentStageIndex}
            onClick={() => onStageClick?.(stage.id)}
          />
        ))}
      </CarbonProgressIndicator>

      <div className="progress-indicator__current-stage">
        {stages[currentStageIndex] && (
          <>
            <div className="progress-indicator__current-stage-header">
              {getStageIcon(stages[currentStageIndex].status)}
              <h4 className="progress-indicator__current-stage-title">
                {stages[currentStageIndex].label}
              </h4>
            </div>
            {stages[currentStageIndex].description && (
              <p className="progress-indicator__current-stage-description">
                {stages[currentStageIndex].description}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressIndicator;

// Made with Bob
