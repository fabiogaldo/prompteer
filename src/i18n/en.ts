/**
 * English (en) UI string dictionary for Prompteer.
 * Pure TypeScript — No hardcoded UI strings inside JSX components.
 */

export const i18n = {
  app: {
    name: 'Prompteer',
    badge: 'v1.0 MVP',
    tagline: 'Zero-Friction Prompt Generator',
    description:
      'Transform your everyday goals into structured, fact-checked AI prompts routed to the best model.',
    github: 'GitHub',
    footerDisclaimer: '100% Client-Side & Zero-Auth. No login, tracking, or backend database required.',
  },
  wizard: {
    stepIndicator: 'Step {current} of {total}',
    steps: {
      category: 'Category',
      objective: 'Objective',
      details: 'Details',
      rigor: 'Tone & Rigor',
      result: 'Result',
    },
    navigation: {
      back: 'Back',
      next: 'Next',
      generate: 'Generate Prompt',
      startOver: 'Start Over',
      reset: 'Reset',
      edit: 'Edit Inputs',
    },
  },
  stepCategory: {
    title: 'What do you want to accomplish?',
    subtitle:
      'Choose a primary context to tailor the structure and intelligence of your prompt.',
    selectButton: 'Select Category',
    exampleUseCasesLabel: 'Ideal for:',
  },
  stepObjective: {
    title: 'Choose your specific objective',
    subtitle:
      'Select the concrete outcome you want to produce. Review the example preview snippet below each choice.',
    previewLabel: 'Expected Output Snippet:',
    recommendedAgentLabel: 'Optimized for:',
  },
  stepDetails: {
    title: 'Provide quick context details',
    subtitle:
      'Fill in 2 to 3 key details. Optional fields will automatically fall back to bracketed placeholders if left blank.',
    requiredTag: 'Required',
    optionalTag: 'Optional (defaults to placeholder)',
    tipNotice: 'Leave optional fields empty if you want the prompt to include editable placeholders like [INSERT DATE].',
  },
  stepRigor: {
    title: 'Set Tone & Fact-Checking Rigor',
    subtitle:
      'Confirm how the AI should communicate and how strictly it should verify facts before generating.',
    toneSectionTitle: 'Tone of Voice',
    toneSectionSubtitle: 'Select how your output should sound (pre-configured based on your objective).',
    tones: {
      formal: {
        label: 'Formal & Corporate',
        description:
          'Polished, authoritative workplace communication suitable for leadership and official announcements.',
      },
      direct: {
        label: 'Direct & Clear',
        description:
          'Concise, high-efficiency copy with no filler words or preamble.',
      },
      friendly: {
        label: 'Warm & Friendly',
        description:
          'Approachable, empathetic, and inviting tone perfect for teams and community events.',
      },
      persuasive: {
        label: 'Persuasive & Engaging',
        description:
          'Compelling, conversion-focused copy designed to drive action and interest.',
      },
    },
    rigorSectionTitle: 'Factuality & Verification Rigor',
    rigorSectionSubtitle:
      'Control whether the AI is allowed to extrapolate or must cross-check facts.',
    rigorLevels: {
      creative: {
        label: 'Creative / Open',
        badge: 'High Freedom',
        description:
          'AI is encouraged to brainstorm, embellish details, and add imaginative flair freely.',
      },
      balanced: {
        label: 'Balanced (Default)',
        badge: 'Recommended',
        description:
          'Stick strictly to provided facts without inventing unverified specifications or data.',
      },
      strict: {
        label: 'Strict Fact-Check',
        badge: 'High Rigor',
        description:
          'Injects explicit instructions to verify premises, flag inconsistencies, avoid assumptions, and highlight uncertainties.',
      },
    },
    strictNotice: {
      title: 'Fact-Checking & Hallucination Advisory',
      body: 'AI models can hallucinate plausible-sounding errors or unthinkingly amplify incorrect premises in your inputs (such as mismatched calendar dates or conflicting schedules). In Strict mode, the prompt compels the AI to cross-verify all chronological details, question conflicting assumptions, and explicitly flag uncertainties.',
    },
  },
  stepResult: {
    title: 'Your Prompt is Ready!',
    subtitle:
      'Review the generated prompt below and send it directly to the recommended AI model.',
    promptBoxTitle: 'Generated Prompt',
    charCount: '{count} characters',
    copyPrompt: 'Copy Prompt',
    copiedPrompt: 'Copied!',
    recommendedAgentCardTitle: 'Recommended AI Model',
    whyAgent: 'Why this model:',
    openDirectCTA: 'Open in {agent} ↗',
    copyAndOpenCTA: 'Copy Prompt & Open {agent} ↗',
    openDirectToast:
      'Opening {agent}... (Prompt also copied to clipboard as backup)',
    copyAndOpenToast:
      'Prompt copied to clipboard! Opening {agent} in a new tab...',
    copySuccessToast: 'Prompt copied to clipboard!',
    copyErrorToast:
      'Failed to copy prompt to clipboard. Please select and copy manually.',
    createAnother: 'Create Another Prompt',
    editSettings: 'Modify Parameters',
  },
};

export type I18nDictionary = typeof i18n;
