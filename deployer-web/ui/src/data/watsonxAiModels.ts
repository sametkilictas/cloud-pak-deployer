/**
 * watsonx.ai Foundation Models
 *
 * Complete list of available foundation models for watsonx.ai
 * Extracted from reference-config.yaml
 */

export interface WatsonxAiModel {
  model_id: string;
  category: string;
  description: string;
}

export const WATSONX_AI_MODELS: WatsonxAiModel[] = [
  // Allam Models
  { model_id: 'allam-1-13b-instruct', category: 'Allam', description: 'Allam 13B instruction-tuned model' },
  
  // Code Llama Models
  { model_id: 'codellama-codellama-34b-instruct-hf', category: 'Code Llama', description: 'Code Llama 34B instruction-tuned model' },
  
  // Mistral Family Models
  { model_id: 'codestral-2501', category: 'Mistral', description: 'Codestral 25.01 code generation model' },
  { model_id: 'codestral-2508', category: 'Mistral', description: 'Codestral 25.08 code generation model' },
  { model_id: 'codestral-22b', category: 'Mistral', description: 'Codestral 22B code generation model' },
  { model_id: 'devstral-medium-2507', category: 'Mistral', description: 'Devstral Medium 25.07 development model' },
  { model_id: 'ministral-8b-instruct', category: 'Mistral', description: 'Ministral 8B instruction-tuned model' },
  { model_id: 'mistral-small-3-2-24b-instruct-2506', category: 'Mistral', description: 'Mistral Small 3.2 24B instruction model' },
  { model_id: 'mistral-small-3-1-24b-instruct-2503', category: 'Mistral', description: 'Mistral Small 3.1 24B instruction model' },
  { model_id: 'mistral-medium-2505', category: 'Mistral', description: 'Mistral Medium 25.05 model' },
  { model_id: 'mistral-medium-2508', category: 'Mistral', description: 'Mistral Medium 25.08 model' },
  { model_id: 'mistral-large-instruct-2411', category: 'Mistral', description: 'Mistral Large instruction model' },
  { model_id: 'pixtral-large-instruct', category: 'Mistral', description: 'Pixtral Large multimodal instruction model' },
  { model_id: 'voxtral-small-2507', category: 'Mistral', description: 'Voxtral Small 25.07 voice model' },
  
  // Google Models
  { model_id: 'google-flan-t5-xl', category: 'Google', description: 'Google Flan-T5 XL model' },
  
  // GPT Models
  { model_id: 'gpt-oss-20b', category: 'GPT', description: 'GPT OSS 20B open-source model' },
  { model_id: 'gpt-oss-120b', category: 'GPT', description: 'GPT OSS 120B open-source model' },
  
  // Granite 4 Models
  { model_id: 'granite-4-h-micro', category: 'Granite', description: 'Granite 4 Micro model' },
  { model_id: 'granite-4-h-tiny', category: 'Granite', description: 'Granite 4 Tiny model' },
  { model_id: 'granite-4-h-small', category: 'Granite', description: 'Granite 4 Small model' },
  
  // Granite 3 Models
  { model_id: 'ibm-granite-13b-instruct-v2', category: 'Granite', description: 'IBM Granite 13B instruction v2 model' },
  { model_id: 'granite-3-2-8b-instruct', category: 'Granite', description: 'Granite 3.2 8B instruction model' },
  { model_id: 'granite-3-3-8b-instruct', category: 'Granite', description: 'Granite 3.3 8B instruction model' },
  { model_id: 'granite-3-2b-instruct', category: 'Granite', description: 'Granite 3 2B instruction model' },
  { model_id: 'granite-3-8b-instruct', category: 'Granite', description: 'Granite 3 8B instruction model' },
  
  // Granite Guardian Models
  { model_id: 'granite-guardian-3-2b', category: 'Granite', description: 'Granite Guardian 3 2B safety model' },
  { model_id: 'granite-guardian-3-8b', category: 'Granite', description: 'Granite Guardian 3 8B safety model' },
  { model_id: 'granite-guardian-3-2-5b', category: 'Granite', description: 'Granite Guardian 3.2 5B safety model' },
  
  // Granite Code Models
  { model_id: 'granite-3b-code-instruct', category: 'Granite', description: 'Granite 3B code instruction model' },
  { model_id: 'granite-8b-code-instruct', category: 'Granite', description: 'Granite 8B code instruction model' },
  { model_id: 'granite-20b-code-instruct', category: 'Granite', description: 'Granite 20B code instruction model' },
  { model_id: 'granite-20b-code-base-schema-linking', category: 'Granite', description: 'Granite 20B code schema linking model' },
  { model_id: 'granite-20b-code-base-sql-gen', category: 'Granite', description: 'Granite 20B code SQL generation model' },
  { model_id: 'granite-34b-code-instruct', category: 'Granite', description: 'Granite 34B code instruction model' },
  
  // Granite Specialized Models
  { model_id: 'granite-docling-258M', category: 'Granite', description: 'Granite Docling 258M document model' },
  { model_id: 'granite-vision-3-2-2b', category: 'Granite', description: 'Granite Vision 3.2 2B multimodal model' },
  { model_id: 'granite-vision-3-3-2b', category: 'Granite', description: 'Granite Vision 3.3 2B multimodal model' },
  
  // IBM Defense Models
  { model_id: 'ibm-defense-3-3-8b-instruct', category: 'IBM Defense', description: 'IBM Defense 3.3 8B instruction model' },
  { model_id: 'ibm-defense-4-0-micro', category: 'IBM Defense', description: 'IBM Defense 4.0 Micro model' },
  
  // Jais Models
  { model_id: 'core42-jais-13b-chat', category: 'Jais', description: 'Core42 Jais 13B chat model' },
  
  // Llama 3.2 Models
  { model_id: 'llama-3-2-1b-instruct', category: 'Llama', description: 'Llama 3.2 1B instruction model' },
  { model_id: 'llama-3-2-3b-instruct', category: 'Llama', description: 'Llama 3.2 3B instruction model' },
  { model_id: 'llama-3-2-11b-vision-instruct', category: 'Llama', description: 'Llama 3.2 11B vision instruction model' },
  { model_id: 'llama-3-2-90b-vision-instruct', category: 'Llama', description: 'Llama 3.2 90B vision instruction model' },
  
  // Llama 3.3 Models
  { model_id: 'llama-3-3-70b-instruct', category: 'Llama', description: 'Llama 3.3 70B instruction model' },
  
  // Llama 3.1 Models
  { model_id: 'llama-3-1-8b-instruct', category: 'Llama', description: 'Llama 3.1 8B instruction model' },
  { model_id: 'llama-3-1-70b-instruct', category: 'Llama', description: 'Llama 3.1 70B instruction model' },
  
  // Llama 4 Models
  { model_id: 'llama-4-maverick-17b-128e-instruct-fp8', category: 'Llama', description: 'Llama 4 Maverick 17B FP8 instruction model' },
  { model_id: 'llama-4-maverick-17b-128e-instruct-int4', category: 'Llama', description: 'Llama 4 Maverick 17B INT4 instruction model' },
  { model_id: 'llama-4-scout-17b-16e-instruct', category: 'Llama', description: 'Llama 4 Scout 17B instruction model' },
  { model_id: 'llama-4-scout-17b-16e-instruct-int4', category: 'Llama', description: 'Llama 4 Scout 17B INT4 instruction model' },
  
  // Llama Guard Models
  { model_id: 'llama-guard-3-11b-vision', category: 'Llama', description: 'Llama Guard 3 11B vision safety model' },
  
  // Embedding Models
  { model_id: 'all-minilm-l6-v2', category: 'Embedding', description: 'All-MiniLM-L6-v2 embedding model' },
  { model_id: 'all-minilm-l12-v2', category: 'Embedding', description: 'All-MiniLM-L12-v2 embedding model' },
  { model_id: 'granite-embedding-107m-multilingual', category: 'Embedding', description: 'Granite 107M multilingual embedding model' },
  { model_id: 'granite-embedding-278m-multilingual', category: 'Embedding', description: 'Granite 278M multilingual embedding model' },
  { model_id: 'granite-embedding-english-reranker-r2', category: 'Embedding', description: 'Granite English reranker R2 model' },
  { model_id: 'multilingual-e5-large', category: 'Embedding', description: 'Multilingual E5 Large embedding model' },
  { model_id: 'ibm-slate-30m-english-rtrvr', category: 'Embedding', description: 'IBM Slate 30M English retriever model' },
  { model_id: 'ibm-slate-125m-english-rtrvr', category: 'Embedding', description: 'IBM Slate 125M English retriever model' },
  { model_id: 'ms-marco-minilm-l-12-v2', category: 'Embedding', description: 'MS MARCO MiniLM-L-12-v2 model' },
];

// Made with Bob