/**
 * ModelConfigurationSection Component
 * 
 * Handles model selection and configuration for components that support models (e.g., watsonx.ai).
 * Displays available models with search/filter capabilities and allows users to select which models to install.
 */

import React, { useState, useMemo } from 'react';
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableSelectAll,
  TableSelectRow,
  Button,
  Tag,
  InlineNotification,
} from '@carbon/react';
import { Add, TrashCan } from '@carbon/icons-react';
import './ModelConfigurationSection.css';

interface Model {
  model_id: string;
  state: 'installed' | 'removed';
  model_install_parameters?: Record<string, any>;
}

interface ModelConfigurationSectionProps {
  availableModels: Array<{ model_id: string; category?: string; description?: string }>;
  selectedModels: Model[];
  onChange: (models: Model[]) => void;
}

export const ModelConfigurationSection: React.FC<ModelConfigurationSectionProps> = ({
  availableModels,
  selectedModels,
  onChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter models based on search term
  const filteredModels = useMemo(() => {
    if (!searchTerm) return availableModels;
    const term = searchTerm.toLowerCase();
    return availableModels.filter(model =>
      model.model_id.toLowerCase().includes(term) ||
      model.category?.toLowerCase().includes(term) ||
      model.description?.toLowerCase().includes(term)
    );
  }, [availableModels, searchTerm]);

  // Get selected model IDs for quick lookup
  const selectedModelIds = useMemo(() => {
    return new Set(selectedModels.map(m => m.model_id));
  }, [selectedModels]);

  // Handle model selection toggle
  const handleModelToggle = (modelId: string, isSelected: boolean) => {
    if (isSelected) {
      // Add model
      onChange([...selectedModels, { model_id: modelId, state: 'installed' }]);
    } else {
      // Remove model
      onChange(selectedModels.filter(m => m.model_id !== modelId));
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    const allModels = filteredModels.map(m => ({
      model_id: m.model_id,
      state: 'installed' as const,
    }));
    onChange(allModels);
  };

  // Handle deselect all
  const handleDeselectAll = () => {
    onChange([]);
  };

  // Categorize models
  const modelsByCategory = useMemo(() => {
    const categories: Record<string, typeof availableModels> = {
      'Granite': [],
      'Llama': [],
      'Mistral': [],
      'Embedding': [],
      'Other': [],
    };

    filteredModels.forEach(model => {
      const id = model.model_id.toLowerCase();
      if (id.includes('granite')) {
        categories['Granite'].push(model);
      } else if (id.includes('llama')) {
        categories['Llama'].push(model);
      } else if (id.includes('mistral') || id.includes('codestral') || id.includes('devstral') || id.includes('voxtral') || id.includes('pixtral') || id.includes('ministral')) {
        categories['Mistral'].push(model);
      } else if (id.includes('embedding') || id.includes('minilm') || id.includes('slate') || id.includes('e5-large') || id.includes('marco')) {
        categories['Embedding'].push(model);
      } else {
        categories['Other'].push(model);
      }
    });

    return categories;
  }, [filteredModels]);

  const headers = [
    { key: 'model_id', header: 'Model ID' },
    { key: 'category', header: 'Category' },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div className="model-config-section">
      <div className="model-config-section__header">
        <h4 className="model-config-section__title">Foundation Models</h4>
        <p className="model-config-section__description">
          Select which foundation models to install with watsonx.ai. Models can be added or removed after initial deployment.
        </p>
      </div>

      {selectedModels.length > 0 && (
        <InlineNotification
          kind="info"
          title={`${selectedModels.length} model${selectedModels.length !== 1 ? 's' : ''} selected`}
          subtitle="Selected models will be installed and available for use in watsonx.ai"
          hideCloseButton
          lowContrast
        />
      )}

      <DataTable
        rows={filteredModels.map((model, index) => ({
          id: model.model_id,
          model_id: model.model_id,
          category: model.category || getCategoryForModel(model.model_id),
          status: selectedModelIds.has(model.model_id) ? 'Selected' : 'Available',
        }))}
        headers={headers}
        isSortable
      >
        {({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getSelectionProps,
          getTableProps,
          getTableContainerProps,
          selectAll,
          selectRow,
        }) => (
          <div {...getTableContainerProps()}>
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch
                  placeholder="Search models..."
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                />
                <Button
                  kind="primary"
                  size="sm"
                  renderIcon={Add}
                  onClick={handleSelectAll}
                  disabled={filteredModels.length === 0}
                >
                  Select All ({filteredModels.length})
                </Button>
                <Button
                  kind="ghost"
                  size="sm"
                  renderIcon={TrashCan}
                  onClick={handleDeselectAll}
                  disabled={selectedModels.length === 0}
                >
                  Clear Selection
                </Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  <TableSelectAll
                    {...getSelectionProps()}
                    onSelect={handleSelectAll}
                    checked={selectedModels.length === filteredModels.length && filteredModels.length > 0}
                  />
                  {headers.map((header: any) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: any) => {
                  const isSelected = selectedModelIds.has(row.id);
                  return (
                    <TableRow {...getRowProps({ row })}>
                      <TableSelectRow
                        {...getSelectionProps({ row })}
                        checked={isSelected}
                        onSelect={() => handleModelToggle(row.id, !isSelected)}
                      />
                      {row.cells.map((cell: any) => (
                        <TableCell key={cell.id}>
                          {cell.info.header === 'status' ? (
                            <Tag type={isSelected ? 'green' : 'gray'} size="sm">
                              {cell.value}
                            </Tag>
                          ) : (
                            cell.value
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </DataTable>

      {filteredModels.length === 0 && (
        <InlineNotification
          kind="info"
          title="No models found"
          subtitle={searchTerm ? `No models match "${searchTerm}"` : 'No models available'}
          hideCloseButton
        />
      )}
    </div>
  );
};

// Helper function to categorize models
function getCategoryForModel(modelId: string): string {
  const id = modelId.toLowerCase();
  if (id.includes('granite')) return 'Granite';
  if (id.includes('llama')) return 'Llama';
  if (id.includes('mistral') || id.includes('codestral') || id.includes('devstral') || id.includes('voxtral') || id.includes('pixtral') || id.includes('ministral')) return 'Mistral';
  if (id.includes('embedding') || id.includes('minilm') || id.includes('slate') || id.includes('e5-large') || id.includes('marco')) return 'Embedding';
  if (id.includes('allam')) return 'Allam';
  if (id.includes('codellama')) return 'Code Llama';
  if (id.includes('flan')) return 'Flan-T5';
  if (id.includes('gpt')) return 'GPT';
  if (id.includes('jais')) return 'Jais';
  return 'Other';
}

// Made with Bob