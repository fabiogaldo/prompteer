/**
 * i18n resolver for Prompteer.
 * Pure TypeScript — Zero dependencies on React, Next.js, or DOM APIs.
 */

import { Locale } from '@/core/types';
import { en, I18nDictionary } from './en';
import { pt } from './pt';

export { en } from './en';
export { pt } from './pt';
export type { I18nDictionary } from './en';

export function getI18n(locale: Locale = 'en'): I18nDictionary {
  return locale === 'pt' ? pt : en;
}

