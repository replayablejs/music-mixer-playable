import type { ReplayableLocalizationInput } from '@replayablejs/config';

// Separate builds; Replayable selects matching text and hand artwork at build time.
export default {
  languages: ['en', 'fr', 'it'],
  fallback: 'en',
} satisfies ReplayableLocalizationInput;
