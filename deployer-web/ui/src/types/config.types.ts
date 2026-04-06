/**
 * Configuration Types
 * Defines the structure for Cloud Pak configuration files
 */

export interface CloudPakConfig {
  global_config: GlobalConfig;
  openshift: OpenShiftConfig[];
  cp4d: CP4DConfig[];
}

export interface GlobalConfig {
  environment_name: string;
  cloud_platform: 'existing-ocp' | 'aws' | 'azure' | 'ibm-cloud' | 'vsphere';
  confirm_destroy: boolean;
  optimize_deploy: boolean;
  env_id: string;
}

export interface OpenShiftConfig {
  name: string;
  ocp_version: string;
  cluster_name: string;
  domain_name: string;
  mcg?: {
    install: boolean;
    storage_type?: string;
    storage_class?: string;
  };
  gpu?: {
    install: 'auto' | 'yes' | 'no';
  };
  openshift_ai?: {
    install: 'auto' | 'yes' | 'no';
    channel?: string;
  };
  openshift_storage?: Array<{
    storage_name: string;
    storage_type: string;
  }>;
}

export interface CP4DConfig {
  project: string;
  openshift_cluster_name: string;
  cp4d_version: string;
  cp4d_entitlement: string[];
  cp4d_production_license: boolean;
  accept_licenses: boolean;
  db2u_limited_privileges?: boolean;
  operators_project?: string;
  ibm_cert_manager?: boolean;
  install_day0_patch?: boolean;
  state: 'installed' | 'removed';
  cartridges: CartridgeConfig[];
}

export interface CartridgeConfig {
  name: string;
  description?: string;
  size?: 'small' | 'medium' | 'large';
  state: 'installed' | 'removed';
  scale?: string;
  installation_options?: Record<string, any>;
  instances?: InstanceConfig[];
  models?: ModelConfig[];
  replicas?: number;
  license_service?: {
    threads_per_core?: number;
  };
}

export interface InstanceConfig {
  name: string;
  description?: string;
  size?: string;
  storage_class?: string;
  storage_size_gb?: number;
  metadata_size_gb?: number;
  data_size_gb?: number;
  backup_size_gb?: number;
  transactionlog_size_gb?: number;
  metastore_ref?: string;
}

export interface ModelConfig {
  model_id: string;
  state: 'installed' | 'removed';
  model_install_parameters?: {
    shards?: number;
    nodeSelector?: Record<string, string>;
  };
}

export interface SavedConfiguration {
  name: string;
  config: CloudPakConfig;
  timestamp: string;
  description?: string;
}

// Made with Bob
