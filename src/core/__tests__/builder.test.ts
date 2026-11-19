import { describe, it, expect } from 'vitest';
import {
  buildPrompt,
  getFactCheckInstructions,
  getToneInstructions,
  resolveFieldValues,
} from '../builder';
import { CATALOG_EN, getCategoryById, getObjectiveById } from '../catalog/en';
import { AGENTS, getAgent, MAX_URL_QUERY_LENGTH, resolveAgentAction } from '../agents';
import { AgentId, BuildPromptParams, InputField } from '../types';

describe('Prompteer Core Engine', () => {
  describe('Catalog Integrity', () => {
    it('contains exactly 3 categories with 2 objectives each', () => {
      expect(CATALOG_EN).toHaveLength(3);
      const totalObjectives = CATALOG_EN.reduce(
        (sum, cat) => sum + cat.objectives.length,
        0
      );
      expect(totalObjectives).toBe(6);
    });

    it('each category has valid properties and at least one example use case', () => {
      for (const cat of CATALOG_EN) {
        expect(cat.id).toBeDefined();
        expect(cat.title).toBeTruthy();
        expect(cat.description).toBeTruthy();
        expect(cat.exampleUseCases.length).toBeGreaterThan(0);
      }
    });

    it('each objective has valid fields with fallback placeholders and template functions', () => {
      for (const cat of CATALOG_EN) {
        for (const obj of cat.objectives) {
          expect(obj.id).toBeTruthy();
          expect(obj.categoryId).toBe(cat.id);
          expect(obj.outputPreviewSnippet).toBeTruthy();
          expect(obj.recommendedAgent).toBeTruthy();
          expect(AGENTS[obj.recommendedAgent]).toBeDefined();
          expect(obj.fields.length).toBeGreaterThanOrEqual(2);
          for (const field of obj.fields) {
            expect(field.id).toBeTruthy();
            expect(field.label).toBeTruthy();
            expect(field.fallbackPlaceholder).toMatch(/^\[.+\]$/);
          }
        }
      }
    });

    it('getCategoryById and getObjectiveById lookup functions work correctly', () => {
      expect(getCategoryById('corporate')?.id).toBe('corporate');
      expect(getCategoryById('nonexistent')).toBeUndefined();

      expect(getObjectiveById('corporate', 'holiday-announcement')?.id).toBe(
        'holiday-announcement'
      );
      expect(getObjectiveById('corporate', 'invalid-obj')).toBeUndefined();
      expect(getObjectiveById('invalid-cat', 'holiday-announcement')).toBeUndefined();
    });
  });

  describe('Field Fallback Resolution', () => {
    const sampleFields: InputField[] = [
      {
        id: 'holidayName',
        label: 'Holiday',
        placeholder: 'e.g. Thanksgiving',
        type: 'text',
        fallbackPlaceholder: '[INSERT HOLIDAY OR OCCASION]',
      },
      {
        id: 'dates',
        label: 'Dates',
        placeholder: 'e.g. Nov 27',
        type: 'text',
        fallbackPlaceholder: '[INSERT DATES & OPERATING HOURS]',
      },
    ];

    it('uses provided values when trimmed strings are provided', () => {
      const values = {
        holidayName: '  New Year Eve  ',
        dates: 'Dec 31',
      };
      const result = resolveFieldValues(sampleFields, values);
      expect(result.holidayName).toBe('New Year Eve');
      expect(result.dates).toBe('Dec 31');
    });

    it('falls back to bracketed placeholders when fields are empty, whitespace, or undefined', () => {
      const values = {
        holidayName: '   ',
        // dates is omitted
      };
      const result = resolveFieldValues(sampleFields, values);
      expect(result.holidayName).toBe('[INSERT HOLIDAY OR OCCASION]');
      expect(result.dates).toBe('[INSERT DATES & OPERATING HOURS]');
    });

    it('buildPrompt uses bracketed fallbacks when user submits blank inputs', () => {
      const params: BuildPromptParams = {
        categoryId: 'corporate',
        objectiveId: 'holiday-announcement',
        fieldValues: {},
        tone: 'formal',
        rigor: 'balanced',
      };
      const result = buildPrompt(params);
      expect(result.prompt).toContain('[INSERT HOLIDAY OR OCCASION]');
      expect(result.prompt).toContain('[INSERT DATES & OPERATING HOURS]');
      expect(result.prompt).toContain(
        '[INSERT EMERGENCY CONTACT OR ON-CALL ESCALATION PATH]'
      );
    });
  });

  describe('Tone Configuration', () => {
    it('returns appropriate tone instruction for each tone', () => {
      expect(getToneInstructions('formal')).toContain('formal, professional');
      expect(getToneInstructions('direct')).toContain('concise, direct');
      expect(getToneInstructions('friendly')).toContain('warm, welcoming');
      expect(getToneInstructions('persuasive')).toContain('compelling, high-converting');
    });

    it('injects tone instructions into generated prompt', () => {
      const params: BuildPromptParams = {
        categoryId: 'sales',
        objectiveId: 'freelance-pitch',
        fieldValues: {
          serviceType: 'Mobile App UX Audits',
          targetClient: 'Fintech Startups',
        },
        tone: 'friendly',
        rigor: 'balanced',
      };
      const result = buildPrompt(params);
      expect(result.prompt).toContain('### TONE & COMMUNICATION STYLE');
      expect(result.prompt).toContain(
        'Use a warm, welcoming, empathetic, and approachable tone of voice.'
      );
    });
  });

  describe('Fact-Checking & Rigor Injection', () => {
    it('generates strict instructions warning against hallucinations and requiring premise verification', () => {
      const strictInstructions = getFactCheckInstructions('strict');
      expect(strictInstructions).toContain(
        'CRITICAL FACT-CHECKING & VERIFICATION INSTRUCTIONS'
      );
      expect(strictInstructions).toContain('Verify all factual premises before answering');
      expect(strictInstructions).toContain('chronological or contextual inconsistencies');
      expect(strictInstructions).toContain('Do not assume, extrapolate, or invent facts');
      expect(strictInstructions).toContain('explicitly state the uncertainty');
    });

    it('generates balanced factuality instructions', () => {
      const balancedInstructions = getFactCheckInstructions('balanced');
      expect(balancedInstructions).toContain('FACTUALITY & ACCURACY GUIDELINES');
      expect(balancedInstructions).toContain(
        'Adhere strictly to the facts, constraints, and details provided above'
      );
    });

    it('generates creative guidelines for creative rigor', () => {
      const creativeInstructions = getFactCheckInstructions('creative');
      expect(creativeInstructions).toContain('CREATIVE GUIDELINES');
      expect(creativeInstructions).toContain('brainstorm, embellish, and add creative flair');
    });

    it('injects strict fact-checking section into the built prompt when rigor is strict', () => {
      const params: BuildPromptParams = {
        categoryId: 'corporate',
        objectiveId: 'holiday-announcement',
        fieldValues: {
          holidayName: 'Thanksgiving',
          dates: 'Thursday, Nov 26 - Friday, Nov 27',
        },
        tone: 'formal',
        rigor: 'strict',
      };
      const result = buildPrompt(params);
      expect(result.prompt).toContain(
        '### CRITICAL FACT-CHECKING & VERIFICATION INSTRUCTIONS'
      );
      expect(result.prompt).toContain('chronological or contextual inconsistencies');
    });
  });

  describe('Agent Routing & Deep-Linking', () => {
    it('recommends expected agents across objectives', () => {
      const holiday = buildPrompt({
        categoryId: 'corporate',
        objectiveId: 'holiday-announcement',
        fieldValues: {},
        tone: 'formal',
        rigor: 'balanced',
      });
      expect(holiday.recommendedAgent.id).toBe('claude');

      const job = buildPrompt({
        categoryId: 'corporate',
        objectiveId: 'job-opening',
        fieldValues: {},
        tone: 'persuasive',
        rigor: 'balanced',
      });
      expect(job.recommendedAgent.id).toBe('chatgpt');

      const product = buildPrompt({
        categoryId: 'sales',
        objectiveId: 'product-listing',
        fieldValues: {},
        tone: 'persuasive',
        rigor: 'balanced',
      });
      expect(product.recommendedAgent.id).toBe('perplexity');

      const event = buildPrompt({
        categoryId: 'visuals',
        objectiveId: 'event-invitation',
        fieldValues: {},
        tone: 'friendly',
        rigor: 'creative',
      });
      expect(event.recommendedAgent.id).toBe('gemini');
    });

    it('generates open_direct action for query-param capable agents when length <= 2000', () => {
      const shortPrompt = 'Short prompt under 2000 characters.';
      const chatgptAction = resolveAgentAction('chatgpt', shortPrompt);
      expect(chatgptAction.actionType).toBe('open_direct');
      expect(chatgptAction.url).toBe(
        `https://chatgpt.com/?q=${encodeURIComponent(shortPrompt)}`
      );

      const claudeAction = resolveAgentAction('claude', shortPrompt);
      expect(claudeAction.actionType).toBe('open_direct');
      expect(claudeAction.url).toBe(
        `https://claude.ai/new?q=${encodeURIComponent(shortPrompt)}`
      );

      const perplexityAction = resolveAgentAction('perplexity', shortPrompt);
      expect(perplexityAction.actionType).toBe('open_direct');
      expect(perplexityAction.url).toBe(
        `https://www.perplexity.ai/search?q=${encodeURIComponent(shortPrompt)}`
      );
    });

    it('always uses copy_and_open for Gemini regardless of prompt length', () => {
      const shortPrompt = 'Short invite prompt';
      const geminiAction = resolveAgentAction('gemini', shortPrompt);
      expect(geminiAction.actionType).toBe('copy_and_open');
      expect(geminiAction.url).toBe('https://gemini.google.com/app');
    });

    it('falls back to copy_and_open and base URL when prompt exceeds 2000 characters', () => {
      const longPrompt = 'A'.repeat(MAX_URL_QUERY_LENGTH + 1);
      expect(longPrompt.length).toBe(2001);

      const chatgptFallback = resolveAgentAction('chatgpt', longPrompt);
      expect(chatgptFallback.actionType).toBe('copy_and_open');
      expect(chatgptFallback.url).toBe('https://chatgpt.com/');

      const claudeFallback = resolveAgentAction('claude', longPrompt);
      expect(claudeFallback.actionType).toBe('copy_and_open');
      expect(claudeFallback.url).toBe('https://claude.ai/new');

      const perplexityFallback = resolveAgentAction('perplexity', longPrompt);
      expect(perplexityFallback.actionType).toBe('copy_and_open');
      expect(perplexityFallback.url).toBe('https://www.perplexity.ai/');
    });

    it('boundary check: prompt of exactly 2000 characters uses open_direct for query-param agents', () => {
      const exactPrompt = 'A'.repeat(MAX_URL_QUERY_LENGTH);
      expect(exactPrompt.length).toBe(2000);

      const chatgptAction = resolveAgentAction('chatgpt', exactPrompt);
      expect(chatgptAction.actionType).toBe('open_direct');
      expect(chatgptAction.url).toContain('https://chatgpt.com/?q=');
    });
  });

  describe('Error Handling', () => {
    it('throws when category or objective is not found', () => {
      expect(() =>
        buildPrompt({
          categoryId: 'nonexistent',
          objectiveId: 'holiday-announcement',
          fieldValues: {},
          tone: 'formal',
          rigor: 'balanced',
        })
      ).toThrowError(/not found in category/);
    });

    it('throws when agent ID is invalid', () => {
      expect(() => getAgent('unknown-agent' as unknown as AgentId)).toThrowError(
        /Unknown agent ID/
      );
    });
  });
});
