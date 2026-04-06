/**
 * API Types
 * Defines the structure for API requests and responses
 */

export type DeploymentStage =
  | 'validate'
  | 'prepare'
  | 'provision-infra'
  | 'configure-infra'
  | 'install-cloud-pak'
  | 'configure-cloud-pak'
  | 'deploy-assets'
  | 'smoke-tests'
  | 'mirror';

export interface DeploymentStatus {
  deployer_active: boolean;
  deployer_stage?: DeploymentStage;
  last_step?: string;
  percentage_completed?: number;
  completion_state?: 'Successful' | 'Failed' | null;
  mirror_current_image?: string;
  mirror_number_images?: number;
  service_state?: string;
  cp4d_url?: string;
  cp4d_user?: string;
  cp4d_password?: string;
}

export interface DeployRequest {
  envId: string;
  oc_login_command: string;
  entitlementKey: string;
  adminPassword?: string;
}

export interface DeployResponse {
  status: 'running' | 'started' | 'error';
  message?: string;
  job_name?: string;
}

export interface OCLoginRequest {
  oc_login_command: string;
}

export interface OCLoginResponse {
  code: number;
  error: string;
}

export interface MirrorRequest {
  envId: string;
  entitlementKey: string;
  registry: {
    portable: boolean;
    registryHostname: string;
    registryPort: string;
    registryNS: string;
    registryUser: string;
    registryPassword: string;
  };
}

export interface ConfigurationResponse {
  configuration: string; // YAML string
}

export interface ConfigurationUpdateRequest {
  configuration: string; // YAML string
}

export interface FormatConfigurationRequest {
  configuration: string;
}

export interface FormatConfigurationResponse {
  formatted_configuration: string;
}

export type LogLevel = 'info' | 'warning' | 'error' | 'debug';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  source?: string;
}

export interface ClusterInfo {
  name: string;
  version: string;
  apiUrl: string;
  connected: boolean;
}

export interface LoginResult {
  success: boolean;
  message: string;
  clusterInfo?: ClusterInfo;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Made with Bob
