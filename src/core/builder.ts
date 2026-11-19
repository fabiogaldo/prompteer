/**
 * Pure prompt generation engine.
 * Pure TypeScript only — Zero dependencies on React, Next.js, or DOM APIs.
 */

import {
  BuildPromptParams,
  BuildPromptResult,
  InputField,
  RigorLevel,
  Tone,
} from './types';
import { getObjectiveById } from './catalog/en';
import { getAgent, resolveAgentAction } from './agents';

export function getToneInstructions(tone: Tone): string {
  switch (tone) {
    case 'formal':
      return 'Maintain a formal, professional, polished, and corporate tone throughout.';
    case 'direct':
      return 'Be concise, direct, and crystal clear. Avoid fluff, filler words, or unnecessary preamble.';
    case 'friendly':
      return 'Use a warm, welcoming, empathetic, and approachable tone of voice.';
    case 'persuasive':
      return 'Craft compelling, high-converting copy that emphasizes value and inspires immediate action.';
    default:
      return 'Maintain a clear and engaging tone suitable for the target audience.';
  }
}

export function getFactCheckInstructions(rigor: RigorLevel): string {
  switch (rigor) {
    case 'strict':
      return [
        '### CRITICAL FACT-CHECKING & VERIFICATION INSTRUCTIONS',
        '- Verify all factual premises before answering.',
        '- Flag any chronological or contextual inconsistencies (e.g. mismatched dates, weekdays, or conflicting timeline requirements).',
        '- Do not assume, extrapolate, or invent facts beyond what is explicitly provided in the prompt context.',
        '- If an assertion cannot be verified or key information is missing, explicitly state the uncertainty and request clarification rather than guessing or hallucinating.',
        '- Adhere strictly to verified facts and avoid amplified speculation.',
      ].join('\n');
    case 'balanced':
      return [
        '### FACTUALITY & ACCURACY GUIDELINES',
        '- Adhere strictly to the facts, constraints, and details provided above.',
        '- Do not invent unverified data, names, dates, or specifications.',
        '- Maintain a balanced, objective representation of the provided information without unnecessary embellishment.',
      ].join('\n');
    case 'creative':
      return [
        '### CREATIVE GUIDELINES',
        '- You are free to brainstorm, embellish, and add creative flair, engaging analogies, or imaginative narrative details.',
        '- Feel free to suggest novel angles, vivid imagery, and resonant storytelling while respecting the core intent.',
      ].join('\n');
    default:
      return '';
  }
}

export function resolveFieldValues(
  fields: InputField[],
  values: Record<string, string>
): Record<string, string> {
  const resolved: Record<string, string> = {};

  for (const field of fields) {
    const rawValue = values[field.id];
    if (rawValue && rawValue.trim().length > 0) {
      resolved[field.id] = rawValue.trim();
    } else {
      resolved[field.id] = field.fallbackPlaceholder;
    }
  }

  return resolved;
}

export function buildPrompt(params: BuildPromptParams): BuildPromptResult {
  const objective = getObjectiveById(params.categoryId, params.objectiveId);
  if (!objective) {
    throw new Error(
      `Objective "${params.objectiveId}" not found in category "${params.categoryId}".`
    );
  }

  const sanitizedValues = resolveFieldValues(objective.fields, params.fieldValues);
  const coreBody = objective.template(sanitizedValues, params.tone, params.rigor);
  const toneInstruction = getToneInstructions(params.tone);
  const factCheckInstruction = getFactCheckInstructions(params.rigor);

  const sections: string[] = [
    coreBody,
    '',
    '### TONE & COMMUNICATION STYLE',
    toneInstruction,
  ];

  if (factCheckInstruction) {
    sections.push('', factCheckInstruction);
  }

  sections.push(
    '',
    '### EXECUTION GUIDELINES',
    'Do not include polite meta-chatter or preamble (such as "Sure, here is your draft..."). Deliver the requested sections directly in clean markdown format.'
  );

  const fullPrompt = sections.join('\n');
  const agentInfo = getAgent(objective.recommendedAgent);
  const agentReason = objective.recommendedAgentReason || agentInfo.defaultReason;
  const actionResult = resolveAgentAction(objective.recommendedAgent, fullPrompt);

  return {
    prompt: fullPrompt,
    recommendedAgent: agentInfo,
    agentReason,
    actionType: actionResult.actionType,
    targetUrl: actionResult.url,
    charCount: fullPrompt.length,
  };
}

