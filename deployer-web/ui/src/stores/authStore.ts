/**
 * Authentication Store
 * Manages OpenShift authentication and cluster connection state
 */

import { create } from 'zustand';
import { ClusterInfo, LoginResult } from '@/types';

interface AuthStore {
  // State
  isAuthenticated: boolean;
  clusterInfo: ClusterInfo | null;
  token: string | null;
  user: string | null;
  error: string | null;
  isLoading: boolean;

  // Actions
  login: (command: string) => Promise<void>;
  checkConnection: () => Promise<boolean>;
  logout: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial State
  isAuthenticated: false,
  clusterInfo: null,
  token: null,
  user: null,
  error: null,
  isLoading: false,

  // Login to OpenShift cluster
  login: async (command: string) => {
    set({ isLoading: true, error: null });

    try {
      // Validate command format
      if (!command.trim().startsWith('oc login')) {
        throw new Error('Invalid command. Must start with "oc login"');
      }

      // Extract token from command if present
      const tokenMatch = command.match(/--token[=\s]+([^\s]+)/);
      const token = tokenMatch ? tokenMatch[1] : null;

      // Mock successful login
      // In real implementation, this would call the API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock cluster info
      const clusterInfo: ClusterInfo = {
        name: 'OpenShift Cluster',
        version: '4.14',
        apiUrl: 'https://api.cluster.example.com:6443',
        connected: true
      };

      // Store token in localStorage
      if (token) {
        localStorage.setItem('oc_token', token);
      }

      set({
        isAuthenticated: true,
        clusterInfo,
        token,
        user: 'admin', // Mock user - in real implementation, extract from token or API
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({
        isAuthenticated: false,
        clusterInfo: null,
        token: null,
        isLoading: false,
        error: (error as Error).message
      });
    }
  },

  // Check if connection is still valid
  checkConnection: async () => {
    const { token } = get();

    if (!token) {
      set({ isAuthenticated: false, clusterInfo: null });
      return false;
    }

    try {
      // Mock connection check
      // In real implementation, this would call the API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simulate successful connection
      const clusterInfo: ClusterInfo = {
        name: 'OpenShift Cluster',
        version: '4.14',
        apiUrl: 'https://api.cluster.example.com:6443',
        connected: true
      };

      set({
        isAuthenticated: true,
        clusterInfo
      });

      return true;
    } catch (error) {
      set({
        isAuthenticated: false,
        clusterInfo: null,
        error: 'Connection check failed'
      });
      return false;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('oc_token');
    set({
      isAuthenticated: false,
      clusterInfo: null,
      token: null,
      error: null
    });
  },

  // Set error
  setError: (error: string | null) => {
    set({ error });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  }
}));

// Made with Bob
