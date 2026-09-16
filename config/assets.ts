import type { ReplayableAssetsConfigInput } from '@replayablejs/config';

export default {
  sourceDir: 'assets',
  outDir: 'src/assets/resources',
  assets: {
    sprites: [
      // An empty rule enables default processing for the category.
      {},
      {
        // Select localized artwork at build time; resize 1254×1254 sources to 128×128.
        match: 'hand{,.*}.png',
        options: { scale: 128 / 1254 },
      },
    ],
    locales: [{}],
    sounds: [
      { options: { bitrate: 96, channels: 'source', sampleRate: 44100 } },
      {
        match: 'liquiddnb_*',
        options: { bitrate: 96, channels: 'source', sampleRate: 44100 },
      },
      {
        // Lower bitrate keeps the longer First Light pack compact.
        match: 'firstlight_*',
        options: { bitrate: 64, channels: 'source', sampleRate: 44100 },
      },
    ],
    // Convert to WOFF2, retaining basic characters and the selected locale's glyphs.
    fonts: [{ options: { family: 'Inter' } }],
  },
  emit: {
    assets: 'src/assets/assets.ts',
    registries: 'src/assets/registries',
  },
} satisfies ReplayableAssetsConfigInput;
