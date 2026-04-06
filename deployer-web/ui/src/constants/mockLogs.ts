/**
 * Mock Deployment Logs
 * 
 * Simulated deployment logs for testing the LogViewer component
 * and deployment monitoring functionality.
 */

import { LogEntry } from '../components/common/LogViewer';

export const mockDeploymentLogs: LogEntry[] = [
  {
    timestamp: '2026-04-06 10:00:00',
    level: 'info',
    message: 'Starting Cloud Pak deployment process',
    source: 'deployer'
  },
  {
    timestamp: '2026-04-06 10:00:05',
    level: 'info',
    message: 'Validating configuration file',
    source: 'validator'
  },
  {
    timestamp: '2026-04-06 10:00:10',
    level: 'success',
    message: 'Configuration validation passed',
    source: 'validator'
  },
  {
    timestamp: '2026-04-06 10:00:15',
    level: 'info',
    message: 'Checking OpenShift cluster connectivity',
    source: 'cluster'
  },
  {
    timestamp: '2026-04-06 10:00:20',
    level: 'success',
    message: 'Connected to OpenShift cluster: cpd-demo',
    source: 'cluster'
  },
  {
    timestamp: '2026-04-06 10:00:25',
    level: 'info',
    message: 'Resolving component dependencies',
    source: 'dependency-resolver'
  },
  {
    timestamp: '2026-04-06 10:00:30',
    level: 'debug',
    message: 'Found 5 required dependencies for Watson Machine Learning',
    source: 'dependency-resolver'
  },
  {
    timestamp: '2026-04-06 10:00:35',
    level: 'success',
    message: 'Dependency resolution complete',
    source: 'dependency-resolver'
  },
  {
    timestamp: '2026-04-06 10:00:40',
    level: 'info',
    message: 'Creating project namespace: cpd',
    source: 'openshift'
  },
  {
    timestamp: '2026-04-06 10:00:45',
    level: 'success',
    message: 'Project namespace created successfully',
    source: 'openshift'
  },
  {
    timestamp: '2026-04-06 10:00:50',
    level: 'info',
    message: 'Installing IBM Common Core Services',
    source: 'installer'
  },
  {
    timestamp: '2026-04-06 10:01:00',
    level: 'info',
    message: 'Deploying operator subscriptions',
    source: 'operator'
  },
  {
    timestamp: '2026-04-06 10:01:30',
    level: 'warning',
    message: 'Operator installation taking longer than expected',
    source: 'operator'
  },
  {
    timestamp: '2026-04-06 10:02:00',
    level: 'success',
    message: 'IBM Common Core Services operator installed',
    source: 'operator'
  },
  {
    timestamp: '2026-04-06 10:02:10',
    level: 'info',
    message: 'Installing Watson Studio',
    source: 'installer'
  },
  {
    timestamp: '2026-04-06 10:02:20',
    level: 'debug',
    message: 'Pulling container images for Watson Studio',
    source: 'registry'
  },
  {
    timestamp: '2026-04-06 10:03:00',
    level: 'info',
    message: 'Watson Studio pods starting',
    source: 'kubernetes'
  },
  {
    timestamp: '2026-04-06 10:04:00',
    level: 'success',
    message: 'Watson Studio installed successfully',
    source: 'installer'
  },
  {
    timestamp: '2026-04-06 10:04:10',
    level: 'info',
    message: 'Installing Watson Machine Learning',
    source: 'installer'
  },
  {
    timestamp: '2026-04-06 10:05:00',
    level: 'success',
    message: 'Watson Machine Learning installed successfully',
    source: 'installer'
  },
  {
    timestamp: '2026-04-06 10:05:10',
    level: 'info',
    message: 'Configuring component integrations',
    source: 'configurator'
  },
  {
    timestamp: '2026-04-06 10:05:30',
    level: 'success',
    message: 'Component integrations configured',
    source: 'configurator'
  },
  {
    timestamp: '2026-04-06 10:05:40',
    level: 'info',
    message: 'Running post-installation validation',
    source: 'validator'
  },
  {
    timestamp: '2026-04-06 10:06:00',
    level: 'success',
    message: 'All components validated successfully',
    source: 'validator'
  },
  {
    timestamp: '2026-04-06 10:06:10',
    level: 'success',
    message: 'Deployment completed successfully!',
    source: 'deployer'
  }
];

export const generateMockLog = (
  level: LogEntry['level'],
  message: string,
  source?: string
): LogEntry => ({
  timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
  level,
  message,
  source
});

export const streamMockLogs = (
  onLog: (log: LogEntry) => void,
  interval: number = 2000
): ReturnType<typeof setInterval> => {
  let index = 0;
  
  const timer = setInterval(() => {
    if (index < mockDeploymentLogs.length) {
      onLog(mockDeploymentLogs[index]);
      index++;
    } else {
      clearInterval(timer);
    }
  }, interval);
  
  return timer;
};

// Made with Bob
