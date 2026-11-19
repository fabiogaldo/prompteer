/**
 * Pure prompt generation engine with bilingual support.
 * Pure TypeScript only — Zero dependencies on React, Next.js, or DOM APIs.
 */

import {
  BuildPromptParams,
  BuildPromptResult,
  InputField,
  Locale,
  RigorLevel,
  Tone,
} from './types';
import { getObjectiveById } from './catalog/index';
import { getAgent, resolveAgentAction } from './agents';

export function getToneInstructions(tone: Tone, locale: Locale = 'en'): string {
  if (locale === 'pt') {
    switch (tone) {
      case 'formal':
        return 'Mantenha um tom formal, profissional, polido e corporativo do início ao fim.';
      case 'direct':
        return 'Seja direto, conciso e extremamente claro. Evite rodeios, palavras vazias ou introduções longas.';
      case 'friendly':
        return 'Utilize um tom caloroso, acolhedor, empático e amigável.';
      case 'persuasive':
        return 'Elabore um texto persuasivo e envolvente, que destaque o valor prático e estimule uma ação imediata.';
      default:
        return 'Mantenha um tom claro e engajador adequado ao público-alvo.';
    }
  }

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

export function getFactCheckInstructions(rigor: RigorLevel, locale: Locale = 'en'): string {
  if (locale === 'pt') {
    switch (rigor) {
      case 'strict':
        return [
          '### INSTRUÇÕES CRÍTICAS DE VERIFICAÇÃO DE FATOS E COERÊNCIA',
          '- Verifique todas as premissas factuais antes de responder.',
          '- Aponte eventuais inconsistências cronológicas ou contextuais (ex.: datas incompatíveis com dias da semana ou exigências conflitantes).',
          '- Não invente, não presuma e não extrapole informações além do que foi expressamente fornecido no contexto do prompt.',
          '- Se uma afirmação não puder ser confirmada ou faltarem dados essenciais, declare explicitamente a incerteza e solicite esclarecimento em vez de alucinar ou adivinhar.',
          '- Baseie-se estritamente em fatos verificados e evite especulações desmedidas.',
        ].join('\n');
      case 'balanced':
        return [
          '### DIRETRIZES DE PRECISÃO E FACTUALIDADE',
          '- Siga rigorosamente os fatos, restrições e dados fornecidos acima.',
          '- Não invente dados não verificados, nomes, datas ou especificações.',
          '- Mantenha uma representação equilibrada e objetiva das informações fornecidas sem floreios desnecessários.',
        ].join('\n');
      case 'creative':
        return [
          '### DIRETRIZES DE CRIATIVIDADE',
          '- Você tem total liberdade criativa para sugerir ideias, criar metáforas envolventes e enriquecer a narrativa com detalhes imaginativos.',
          '- Sinta-se livre para propor ângulos originais, descrições vívidas e narrativas envolventes, respeitando o propósito principal.',
        ].join('\n');
      default:
        return '';
    }
  }

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
  const locale = params.locale || 'en';
  const objective = getObjectiveById(params.categoryId, params.objectiveId, locale);
  if (!objective) {
    throw new Error(
      `Objective "${params.objectiveId}" not found in category "${params.categoryId}" for locale "${locale}".`
    );
  }

  const sanitizedValues = resolveFieldValues(objective.fields, params.fieldValues);
  const coreBody = objective.template(sanitizedValues, params.tone, params.rigor);
  const toneInstruction = getToneInstructions(params.tone, locale);
  const factCheckInstruction = getFactCheckInstructions(params.rigor, locale);

  const toneHeader =
    locale === 'pt' ? '### TOM E ESTILO DE COMUNICAÇÃO' : '### TONE & COMMUNICATION STYLE';
  const executionHeader =
    locale === 'pt' ? '### DIRETRIZES DE EXECUÇÃO' : '### EXECUTION GUIDELINES';
  const executionText =
    locale === 'pt'
      ? 'Não inclua conversas iniciais ou preâmbulos vazios (como "Claro! Aqui está o seu texto..."). Entregue as seções solicitadas diretamente em formato markdown limpo.'
      : 'Do not include polite meta-chatter or preamble (such as "Sure, here is your draft..."). Deliver the requested sections directly in clean markdown format.';

  const sections: string[] = [
    coreBody,
    '',
    toneHeader,
    toneInstruction,
  ];

  if (factCheckInstruction) {
    sections.push('', factCheckInstruction);
  }

  sections.push('', executionHeader, executionText);

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
