/**
 * Deployment Store
 * Manages deployment status, progress, and logs
 */

import { create } from 'zustand';
import { DeploymentStatus, LogEntry, DeploymentStage } from '@/types';

interface DeploymentStore {
  // State
  status: DeploymentStatus;
  logs: LogEntry[];
  isDeploying: boolean;
  error: string | null;
  pollingInterval: number | null;

  // Actions
  startDeployment: () => Promise<void>;
  stopDeployment: () => void;
  pollStatus: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
  addLog: (log: LogEntry) => void;
  clearLogs: () => void;
  downloadLogs: () => void;
  resetDeployment: () => void;
  simulateDeployment: () => void;
}

// Mock deployment stages for simulation
const DEPLOYMENT_STAGES: DeploymentStage[] = [
  'validate',
  'prepare',
  'mirror',
  'provision-infra',
  'configure-infra',
  'install-cloud-pak',
  'configure-cloud-pak',
  'deploy-assets',
  'smoke-tests'
];

// Mock log messages for each stage
const STAGE_LOGS: Record<DeploymentStage, string[]> = {
  mirror: [
    'Starting image mirroring...',
    'Connecting to source registry...',
    'Mirroring Cloud Pak images...',
    'Mirroring operator images...',
    'Image mirroring complete'
  ],
  validate: [
    'Starting deployment validation...',
    'Checking configuration file syntax...',
    'Configuration file is valid',
    'Validating component dependencies...',
    'All dependencies satisfied',
    'Validation complete'
  ],
  prepare: [
    'Preparing deployment environment...',
    'Setting up deployment workspace...',
    'Loading configuration...',
    'Initializing deployment variables...',
    'Environment preparation complete'
  ],
  'provision-infra': [
    'Provisioning infrastructure resources...',
    'Creating storage classes...',
    'Storage class "managed-nfs-storage" created',
    'Configuring persistent volumes...',
    'Infrastructure provisioning complete'
  ],
  'configure-infra': [
    'Configuring infrastructure components...',
    'Setting up networking...',
    'Configuring security policies...',
    'Applying resource quotas...',
    'Infrastructure configuration complete'
  ],
  'install-cloud-pak': [
    'Installing Cloud Pak for Data...',
    'Installing operators...',
    'Operator installation complete',
    'Installing cartridges...',
    'Installing Watson Machine Learning...',
    'Installing Watson Studio...',
    'Cartridge installation in progress...',
    'Cloud Pak installation complete'
  ],
  'configure-cloud-pak': [
    'Configuring Cloud Pak for Data...',
    'Setting up authentication...',
    'Configuring storage...',
    'Applying custom configurations...',
    'Cloud Pak configuration complete'
  ],
  'deploy-assets': [
    'Deploying additional assets...',
    'Creating service instances...',
    'Configuring integrations...',
    'Asset deployment complete'
  ],
  'smoke-tests': [
    'Running smoke tests...',
    'Testing API endpoints...',
    'Testing authentication...',
    'Testing component connectivity...',
    'All smoke tests passed',
    'Deployment completed successfully!'
  ]
};

export const useDeploymentStore = create<DeploymentStore>((set, get) => ({
  // Initial State
  status: {
    deployer_active: false
  },
  logs: [],
  isDeploying: false,
  error: null,
  pollingInterval: null,

  // Start deployment (mock)
  startDeployment: async () => {
    set({
      isDeploying: true,
      error: null,
      logs: [],
      status: {
        deployer_active: true,
        deployer_stage: 'validate',
        percentage_completed: 0,
        completion_state: null
      }
    });

    // Add initial log
    get().addLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Deployment initiated'
    });

    // Start polling for status updates
    get().startPolling();

    // Simulate deployment progress
    get().simulateDeployment();
  },

  // Stop deployment
  stopDeployment: () => {
    get().stopPolling();
    set({
      isDeploying: false,
      status: {
        ...get().status,
        deployer_active: false,
        completion_state: 'Failed'
      }
    });

    get().addLog({
      timestamp: new Date().toISOString(),
      level: 'warning',
      message: 'Deployment stopped by user'
    });
  },

  // Poll deployment status (mock)
  pollStatus: async () => {
    // In real implementation, this would call the API
    // For mock, status is updated by simulateDeployment
  },

  // Start polling
  startPolling: () => {
    const interval = window.setInterval(() => {
      get().pollStatus();
    }, 5000); // Poll every 5 seconds

    set({ pollingInterval: interval });
  },

  // Stop polling
  stopPolling: () => {
    const { pollingInterval } = get();
    if (pollingInterval) {
      clearInterval(pollingInterval);
      set({ pollingInterval: null });
    }
  },

  // Add log entry
  addLog: (log: LogEntry) => {
    set(state => ({
      logs: [...state.logs, log]
    }));
  },

  // Clear all logs
  clearLogs: () => {
    set({ logs: [] });
  },

  // Download logs as text file
  downloadLogs: () => {
    const { logs } = get();
    const logText = logs
      .map(log => `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`)
      .join('\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deployment-logs-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Reset deployment state
  resetDeployment: () => {
    get().stopPolling();
    set({
      status: {
        deployer_active: false
      },
      logs: [],
      isDeploying: false,
      error: null
    });
  },

  // Simulate deployment progress (mock)
  simulateDeployment: () => {
    let currentStageIndex = 0;
    let currentLogIndex = 0;
    let percentage = 0;

    const progressInterval = setInterval(() => {
      const stage = DEPLOYMENT_STAGES[currentStageIndex];
      const stageLogs = STAGE_LOGS[stage];

      // Add log message
      if (currentLogIndex < stageLogs.length) {
        get().addLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          message: stageLogs[currentLogIndex]
        });
        currentLogIndex++;
      }

      // Update progress
      percentage += 2;
      if (percentage > 100) percentage = 100;

      // Update status
      set({
        status: {
          deployer_active: true,
          deployer_stage: stage,
          last_step: stageLogs[Math.min(currentLogIndex, stageLogs.length - 1)],
          percentage_completed: percentage,
          completion_state: null
        }
      });

      // Move to next stage
      if (currentLogIndex >= stageLogs.length) {
        currentStageIndex++;
        currentLogIndex = 0;

        // Check if deployment is complete
        if (currentStageIndex >= DEPLOYMENT_STAGES.length) {
          clearInterval(progressInterval);
          get().stopPolling();

          // Set completion status
          set({
            isDeploying: false,
            status: {
              deployer_active: false,
              deployer_stage: 'smoke-tests',
              last_step: 'Deployment completed successfully!',
              percentage_completed: 100,
              completion_state: 'Successful',
              cp4d_url: 'https://cpd-cpd.apps.cluster.example.com',
              cp4d_user: 'admin',
              cp4d_password: 'password123'
            }
          });

          get().addLog({
            timestamp: new Date().toISOString(),
            level: 'info',
            message: '✓ Deployment completed successfully!'
          });
        }
      }
    }, 2000); // Update every 2 seconds
  }
}));

// Made with Bob
