import { describe, it, expect } from 'vitest';
import {
  buildPrompt,
  getFactCheckInstructions,
  getToneInstructions,
  resolveFieldValues,
} from '../builder';
import {
  CATALOG_EN,
  CATALOG_PT,
  getCatalog,
  getCategoryById,
  getObjectiveById,
} from '../catalog/index';
import { AGENTS, getAgent, MAX_URL_QUERY_LENGTH, resolveAgentAction } from '../agents';
import { AgentId, BuildPromptParams, InputField } from '../types';

describe('Prompteer Core Engine', () => {
  describe('Catalog Integrity (English & Portuguese)', () => {
    it('contains exactly 3 categories with 2 objectives each in English', () => {
      expect(CATALOG_EN).toHaveLength(3);
      const totalObjectives = CATALOG_EN.reduce(
        (sum, cat) => sum + cat.objectives.length,
        0
      );
      expect(totalObjectives).toBe(6);
    });

    it('contains exactly 3 categories with 2 objectives each in Portuguese', () => {
      expect(CATALOG_PT).toHaveLength(3);
      const totalObjectives = CATALOG_PT.reduce(
        (sum, cat) => sum + cat.objectives.length,
        0
      );
      expect(totalObjectives).toBe(6);
    });

    it('getCatalog returns appropriate catalog per locale', () => {
      expect(getCatalog('en')).toBe(CATALOG_EN);
      expect(getCatalog('pt')).toBe(CATALOG_PT);
    });

    it('each category in both catalogs has valid properties and examples', () => {
      for (const catalog of [CATALOG_EN, CATALOG_PT]) {
        for (const cat of catalog) {
          expect(cat.id).toBeDefined();
          expect(cat.title).toBeTruthy();
          expect(cat.description).toBeTruthy();
          expect(cat.exampleUseCases.length).toBeGreaterThan(0);
        }
      }
    });

    it('Portuguese catalog adapts examples to Brazilian marketplace platforms', () => {
      const salesCat = CATALOG_PT.find((c) => c.id === 'sales');
      expect(salesCat).toBeDefined();
      const hasBrazilianMarketplaces = salesCat?.exampleUseCases.some((example) =>
        /Mercado Livre|OLX|Enjoei/i.test(example)
      );
      expect(hasBrazilianMarketplaces).toBe(true);

      const productObj = salesCat?.objectives.find((o) => o.id === 'product-listing');
      expect(productObj?.description).toMatch(/Mercado Livre|OLX|Enjoei/i);
    });

    it('each objective in both catalogs has valid fields with fallback placeholders', () => {
      for (const catalog of [CATALOG_EN, CATALOG_PT]) {
        for (const cat of catalog) {
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
      }
    });

    it('getCategoryById and getObjectiveById lookup functions work correctly across locales', () => {
      expect(getCategoryById('corporate', 'en')?.id).toBe('corporate');
      expect(getCategoryById('corporate', 'pt')?.id).toBe('corporate');
      expect(getCategoryById('corporate', 'pt')?.title).toBe('Corporativo & Trabalho');
      expect(getCategoryById('nonexistent')).toBeUndefined();

      expect(getObjectiveById('corporate', 'holiday-announcement', 'en')?.id).toBe(
        'holiday-announcement'
      );
      expect(getObjectiveById('corporate', 'holiday-announcement', 'pt')?.id).toBe(
        'holiday-announcement'
      );
      expect(getObjectiveById('corporate', 'holiday-announcement', 'pt')?.title).toBe(
        'Aviso de Feriado / Emenda de Escala'
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
      };
      const result = resolveFieldValues(sampleFields, values);
      expect(result.holidayName).toBe('[INSERT HOLIDAY OR OCCASION]');
      expect(result.dates).toBe('[INSERT DATES & OPERATING HOURS]');
    });

    it('buildPrompt uses bracketed fallbacks when user submits blank inputs (English)', () => {
      const params: BuildPromptParams = {
        categoryId: 'corporate',
        objectiveId: 'holiday-announcement',
        fieldValues: {},
        tone: 'formal',
        rigor: 'balanced',
        locale: 'en',
      };
      const result = buildPrompt(params);
      expect(result.prompt).toContain('[INSERT HOLIDAY OR OCCASION]');
      expect(result.prompt).toContain('[INSERT DATES & OPERATING HOURS]');
      expect(result.prompt).toContain(
        '[INSERT EMERGENCY CONTACT OR ON-CALL ESCALATION PATH]'
      );
    });

    it('buildPrompt uses Portuguese bracketed fallbacks when user submits blank inputs (Portuguese)', () => {
      const params: BuildPromptParams = {
        categoryId: 'corporate',
        objectiveId: 'holiday-announcement',
        fieldValues: {},
        tone: 'formal',
        rigor: 'balanced',
        locale: 'pt',
      };
      const result = buildPrompt(params);
      expect(result.prompt).toContain('[INSERIR FERIADO OU OCASIÃO]');
      expect(result.prompt).toContain('[INSERIR DATAS E HORÁRIO DE RETORNO]');
      expect(result.prompt).toContain('[INSERIR CONTATO DE PLANTÃO OU ESCALONAMENTO]');
    });
  });

  describe('Tone Configuration & Localization', () => {
    it('returns appropriate tone instruction for each tone in English', () => {
      expect(getToneInstructions('formal', 'en')).toContain('formal, professional');
      expect(getToneInstructions('direct', 'en')).toContain('concise, direct');
      expect(getToneInstructions('friendly', 'en')).toContain('warm, welcoming');
      expect(getToneInstructions('persuasive', 'en')).toContain('compelling, high-converting');
    });

    it('returns appropriate tone instruction for each tone in Portuguese', () => {
      expect(getToneInstructions('formal', 'pt')).toContain('tom formal, profissional');
      expect(getToneInstructions('direct', 'pt')).toContain('direto, conciso e extremamente claro');
      expect(getToneInstructions('friendly', 'pt')).toContain('caloroso, acolhedor');
      expect(getToneInstructions('persuasive', 'pt')).toContain('persuasivo e envolvente');
    });

    it('injects localized tone instructions and headers into Portuguese prompt', () => {
      const params: BuildPromptParams = {
        categoryId: 'sales',
        objectiveId: 'freelance-pitch',
        fieldValues: {
          serviceType: 'Auditoria de Performance Web',
          targetClient: 'Lojas Shopify no Brasil',
        },
        tone: 'friendly',
        rigor: 'balanced',
        locale: 'pt',
      };
      const result = buildPrompt(params);
      expect(result.prompt).toContain('### TOM E ESTILO DE COMUNICAÇÃO');
      expect(result.prompt).toContain('Utilize um tom caloroso, acolhedor, empático e amigável.');
      expect(result.prompt).toContain('### DIRETRIZES DE EXECUÇÃO');
      expect(result.prompt).toContain('Não inclua conversas iniciais ou preâmbulos vazios');
    });
  });

  describe('Fact-Checking & Rigor Injection (English & Portuguese)', () => {
    it('generates English strict instructions warning against hallucinations', () => {
      const strictInstructions = getFactCheckInstructions('strict', 'en');
      expect(strictInstructions).toContain(
        'CRITICAL FACT-CHECKING & VERIFICATION INSTRUCTIONS'
      );
      expect(strictInstructions).toContain('Verify all factual premises before answering');
      expect(strictInstructions).toContain('chronological or contextual inconsistencies');
      expect(strictInstructions).toContain('Do not assume, extrapolate, or invent facts');
      expect(strictInstructions).toContain('explicitly state the uncertainty');
    });

    it('generates Portuguese strict instructions warning against hallucinations and requiring premise verification', () => {
      const strictInstructions = getFactCheckInstructions('strict', 'pt');
      expect(strictInstructions).toContain(
        'INSTRUÇÕES CRÍTICAS DE VERIFICAÇÃO DE FATOS E COERÊNCIA'
      );
      expect(strictInstructions).toContain('Verifique todas as premissas factuais antes de responder');
      expect(strictInstructions).toContain('inconsistências cronológicas ou contextuais');
      expect(strictInstructions).toContain('Não invente, não presuma e não extrapole');
      expect(strictInstructions).toContain('solicite esclarecimento em vez de alucinar ou adivinhar');
    });

    it('generates Portuguese balanced factuality instructions', () => {
      const balancedInstructions = getFactCheckInstructions('balanced', 'pt');
      expect(balancedInstructions).toContain('DIRETRIZES DE PRECISÃO E FACTUALIDADE');
      expect(balancedInstructions).toContain('Siga rigorosamente os fatos, restrições e dados');
    });

    it('generates Portuguese creative guidelines', () => {
      const creativeInstructions = getFactCheckInstructions('creative', 'pt');
      expect(creativeInstructions).toContain('DIRETRIZES DE CRIATIVIDADE');
      expect(creativeInstructions).toContain('total liberdade criativa para sugerir ideias');
    });

    it('injects strict fact-checking section into the built prompt when rigor is strict (Portuguese)', () => {
      const params: BuildPromptParams = {
        categoryId: 'corporate',
        objectiveId: 'holiday-announcement',
        fieldValues: {
          holidayName: 'Carnaval',
          dates: 'Segunda (20/02) e Terça (21/02)',
        },
        tone: 'formal',
        rigor: 'strict',
        locale: 'pt',
      };
      const result = buildPrompt(params);
      expect(result.prompt).toContain(
        '### INSTRUÇÕES CRÍTICAS DE VERIFICAÇÃO DE FATOS E COERÊNCIA'
      );
      expect(result.prompt).toContain('inconsistências cronológicas ou contextuais');
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
