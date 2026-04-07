/**
 * Application Entry Point
 * 
 * Initializes and renders the React application.
 * Sets up global providers and error boundaries.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.scss';

// Error boundary for catching and displaying errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-center full-height" style={{ flexDirection: 'column', gap: '1rem' }}>
          <h1>Something went wrong</h1>
          <p>Please refresh the page or contact support if the problem persists.</p>
          {this.state.error && (
            <details style={{ marginTop: '1rem' }}>
              <summary>Error details</summary>
              <pre style={{ marginTop: '0.5rem', padding: '1rem', background: '#f4f4f4' }}>
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Render the application
const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Made with Bob
