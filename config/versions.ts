import type { ReplayableAssetsConfigInput, ReplayableConfigInput } from '@replayablejs/config';

// Guided play loads 8 sounds first, then the other 16 and celebration artwork.
const tutorialBundles = {
  secondary: {
    include: ['sounds/**', 'sprites/thumbs-up-spritesheet.png'],
    // These eight sounds stay in primary; bundle exclusions do not remove files.
    exclude: [
      'sounds/*_beat_{2,4}.*',
      'sounds/*_bass_{1,4}.*',
      'sounds/*_arp_{1,4}.*',
      'sounds/*_keys_{1,3}.*',
    ],
  },
} satisfies NonNullable<ReplayableAssetsConfigInput['bundles']>;

// Version asset exclusions remove unused files from the export entirely.
export default {
  liquiddnb: {
    params: { soundPack: 'liquiddnb', tutorial: true },
    assets: {
      bundles: tutorialBundles,
      // These eight sounds stay in primary; bundle exclusions do not remove files.
      exclude: ['sounds/firstlight_*'],
    },
  },
  'first-light': {
    params: { soundPack: 'first-light', tutorial: true },
    assets: {
      bundles: tutorialBundles,
      exclude: ['sounds/liquiddnb_*'],
    },
  },
  // Free play inherits primary-only loading: all 24 sounds are ready before play.
  'liquiddnb-no-tutorial': {
    params: { soundPack: 'liquiddnb', tutorial: false },
    assets: {
      exclude: ['sounds/firstlight_*', 'sprites/thumbs-up-spritesheet.png'],
    },
  },
  'first-light-no-tutorial': {
    params: { soundPack: 'first-light', tutorial: false },
    assets: {
      exclude: ['sounds/liquiddnb_*', 'sprites/thumbs-up-spritesheet.png'],
    },
  },
} satisfies ReplayableConfigInput['versions'];
