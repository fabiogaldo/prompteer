/**
 * AI Agent definitions, recommendation rules, and deep-link builders.
 * Pure TypeScript only — Zero dependencies on React, Next.js, or DOM APIs.
 */

import { AgentId, AgentInfo, ActionType } from './types';

export const MAX_URL_QUERY_LENGTH = 2000;

export const AGENTS: Record<AgentId, AgentInfo> = {
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'Best for versatile drafting, role-playing, and persuasive workplace communication.',
    baseUrl: 'https://chatgpt.com/',
    supportsQueryParams: true,
    defaultReason: 'ChatGPT produces clean, professional workplace text with nuanced tone matching.',
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    description: 'Best for deep analytical writing, empathetic pitch copy, and structured documents.',
    baseUrl: 'https://claude.ai/new',
    supportsQueryParams: true,
    defaultReason: 'Claude excels at structured corporate announcements and thoughtful, empathetic communication.',
  },
  perplexity: {
    id: 'perplexity',
    name: 'Perplexity',
    description: 'Best for fact-grounded search, market research, and cited sourcing.',
    baseUrl: 'https://www.perplexity.ai/',
    supportsQueryParams: true,
    defaultReason: 'Perplexity combines live search data with concise, factual synthesis for product pricing and specs.',
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    description: 'Best for multimodal reasoning, visual asset planning, and large context generation.',
    baseUrl: 'https://gemini.google.com/app',
    supportsQueryParams: false,
    defaultReason: 'Gemini delivers outstanding creative image prompts alongside punchy marketing copy.',
  },
};

export function getAgent(agentId: AgentId): AgentInfo {
  const agent = AGENTS[agentId];
  if (!agent) {
    throw new Error(`Unknown agent ID: ${agentId}`);
  }
  return agent;
}

export interface AgentActionResult {
  actionType: ActionType;
  url: string;
}

export function resolveAgentAction(agentId: AgentId, prompt: string): AgentActionResult {
  const agent = getAgent(agentId);
  const promptLength = prompt.length;

  if (agent.supportsQueryParams && promptLength <= MAX_URL_QUERY_LENGTH) {
    let url: string;
    const encoded = encodeURIComponent(prompt);

    switch (agentId) {
      case 'chatgpt':
        url = `https://chatgpt.com/?q=${encoded}`;
        break;
      case 'claude':
        url = `https://claude.ai/new?q=${encoded}`;
        break;
      case 'perplexity':
        url = `https://www.perplexity.ai/search?q=${encoded}`;
        break;
      default:
        url = `${agent.baseUrl}?q=${encoded}`;
    }

    return {
      actionType: 'open_direct',
      url,
    };
  }

  // Fallback for Gemini or long prompts > 2000 chars
  return {
    actionType: 'copy_and_open',
    url: agent.baseUrl,
  };
}

