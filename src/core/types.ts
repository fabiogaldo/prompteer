/**
 * Core domain types and interfaces for Prompteer.
 * Pure TypeScript only — Zero dependencies on React, Next.js, or DOM APIs.
 */

export type Locale = 'en' | 'pt';

export type Tone = 'formal' | 'direct' | 'friendly' | 'persuasive';

export type RigorLevel = 'creative' | 'balanced' | 'strict';

export type AgentId = 'chatgpt' | 'claude' | 'perplexity' | 'gemini';

export type ActionType = 'open_direct' | 'copy_and_open';

export interface AgentInfo {
  id: AgentId;
  name: string;
  description: string;
  baseUrl: string;
  supportsQueryParams: boolean;
  defaultReason: string;
}

export interface InputField {
  id: string;
  label: string;
  placeholder: string;
  description?: string;
  type: 'text' | 'textarea';
  required?: boolean;
  fallbackPlaceholder: string;
}

export interface Objective {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  outputPreviewSnippet: string;
  recommendedAgent: AgentId;
  recommendedAgentReason: string;
  defaultTone: Tone;
  fields: InputField[];
  template: (values: Record<string, string>, tone: Tone, rigor: RigorLevel) => string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  exampleUseCases: string[];
  objectives: Objective[];
}

export interface BuildPromptParams {
  categoryId: string;
  objectiveId: string;
  fieldValues: Record<string, string>;
  tone: Tone;
  rigor: RigorLevel;
  locale?: Locale;
}

export interface BuildPromptResult {
  prompt: string;
  recommendedAgent: AgentInfo;
  agentReason: string;
  actionType: ActionType;
  targetUrl: string;
  charCount: number;
}
