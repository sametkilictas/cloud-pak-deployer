/**
 * Log Viewer Component
 * 
 * Displays deployment logs with real-time streaming support.
 * Features syntax highlighting, filtering, and auto-scroll.
 * 
 * Features:
 * - Real-time log streaming
 * - Log level filtering (info, warning, error, debug)
 * - Search/filter functionality
 * - Auto-scroll toggle
 * - Copy to clipboard
 * - Download logs
 * - Syntax highlighting for different log levels
 * - Timestamp display
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  Button,
  Search,
  Toggle,
  Tag,
  CodeSnippet
} from '@carbon/react';
import {
  Download,
  Copy,
  TrashCan,
  ChevronDown
} from '@carbon/icons-react';
import './LogViewer.css';

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug' | 'success';
  message: string;
  source?: string;
}

interface LogViewerProps {
  logs: LogEntry[];
  isStreaming?: boolean;
  onClear?: () => void;
  maxHeight?: number;
  title?: string;
}

export const LogViewer: React.FC<LogViewerProps> = ({
  logs,
  isStreaming = false,
  onClear,
  maxHeight = 600,
  title = 'Deployment Logs'
}) => {
  const [autoScroll, setAutoScroll] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<Set<string>>(
    new Set(['info', 'warning', 'error', 'debug', 'success'])
  );
  const logContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  // Filter logs based on search term and selected levels
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = searchTerm
      ? log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesLevel = selectedLevels.has(log.level);

    return matchesSearch && matchesLevel;
  });

  // Toggle log level filter
  const toggleLevel = (level: string) => {
    const newLevels = new Set(selectedLevels);
    if (newLevels.has(level)) {
      newLevels.delete(level);
    } else {
      newLevels.add(level);
    }
    setSelectedLevels(newLevels);
  };

  // Copy logs to clipboard
  const handleCopy = () => {
    const logText = filteredLogs
      .map((log) => `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`)
      .join('\n');

    navigator.clipboard.writeText(logText);
  };

  // Download logs as file
  const handleDownload = () => {
    const logText = filteredLogs
      .map((log) => `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`)
      .join('\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deployment-logs-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get log level color
  const getLogLevelColor = (level: string): string => {
    switch (level) {
      case 'error':
        return 'red';
      case 'warning':
        return 'yellow';
      case 'success':
        return 'green';
      case 'debug':
        return 'purple';
      case 'info':
      default:
        return 'blue';
    }
  };

  return (
    <div className="log-viewer">
      <div className="log-viewer__header">
        <h3 className="log-viewer__title">
          {title}
          {isStreaming && (
            <Tag type="blue" size="sm" className="log-viewer__streaming-tag">
              Streaming
            </Tag>
          )}
        </h3>

        <div className="log-viewer__controls">
          <Search
            size="sm"
            placeholder="Search logs..."
            labelText="Search logs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
          />

          <div className="log-viewer__level-filters">
            {['info', 'warning', 'error', 'debug', 'success'].map((level) => (
              <Tag
                key={level}
                type={getLogLevelColor(level) as any}
                size="sm"
                filter
                onClose={() => toggleLevel(level)}
                className={!selectedLevels.has(level) ? 'log-viewer__level-tag--disabled' : ''}
              >
                {level}
              </Tag>
            ))}
          </div>

          <Toggle
            id="auto-scroll-toggle"
            labelText="Auto-scroll"
            size="sm"
            toggled={autoScroll}
            onToggle={setAutoScroll}
          />

          <Button
            kind="ghost"
            size="sm"
            renderIcon={Copy}
            iconDescription="Copy logs"
            hasIconOnly
            onClick={handleCopy}
            disabled={filteredLogs.length === 0}
          />

          <Button
            kind="ghost"
            size="sm"
            renderIcon={Download}
            iconDescription="Download logs"
            hasIconOnly
            onClick={handleDownload}
            disabled={filteredLogs.length === 0}
          />

          {onClear && (
            <Button
              kind="ghost"
              size="sm"
              renderIcon={TrashCan}
              iconDescription="Clear logs"
              hasIconOnly
              onClick={onClear}
              disabled={logs.length === 0}
            />
          )}
        </div>
      </div>

      <div
        ref={logContainerRef}
        className="log-viewer__content"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        {filteredLogs.length === 0 ? (
          <div className="log-viewer__empty">
            {logs.length === 0 ? 'No logs available' : 'No logs match your filters'}
          </div>
        ) : (
          <div className="log-viewer__logs">
            {filteredLogs.map((log, index) => (
              <div
                key={index}
                className={`log-viewer__entry log-viewer__entry--${log.level}`}
              >
                <span className="log-viewer__timestamp">{log.timestamp}</span>
                <Tag
                  type={getLogLevelColor(log.level) as any}
                  size="sm"
                  className="log-viewer__level"
                >
                  {log.level.toUpperCase()}
                </Tag>
                {log.source && (
                  <span className="log-viewer__source">[{log.source}]</span>
                )}
                <span className="log-viewer__message">{log.message}</span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {!autoScroll && filteredLogs.length > 0 && (
        <Button
          kind="ghost"
          size="sm"
          renderIcon={ChevronDown}
          className="log-viewer__scroll-button"
          onClick={scrollToBottom}
        >
          Scroll to bottom
        </Button>
      )}

      <div className="log-viewer__footer">
        <span className="log-viewer__count">
          Showing {filteredLogs.length} of {logs.length} logs
        </span>
      </div>
    </div>
  );
};

export default LogViewer;

// Made with Bob
