import type { ReplayableAssetsConfigInput } from '@replayablejs/config';

export default {
  sourceDir: 'assets',
  outDir: 'src/assets/resources',
  bundles: {
    secondary: {
      include: ['sounds/**', 'sprites/thumbs-up-spritesheet.png'],
      // The eight compact pads stay in primary for either music pack.
      exclude: [
        'sounds/*_beat_{2,4}.*',
        'sounds/*_bass_{1,4}.*',
        'sounds/*_arp_{1,4}.*',
        'sounds/*_keys_{1,3}.*',
      ],
    },
  },
  assets: {
    sprites: [
      {},
      {
        match: 'hand{,.*}.png',
        // Localized source artwork is 1254×1254; deliver it at 128×128.
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
        match: 'firstlight_*',
        options: { bitrate: 64, channels: 'source', sampleRate: 44100 },
      },
    ],
    fonts: [{ options: { family: 'Inter' } }],
  },
  emit: {
    assets: 'src/assets/assets.ts',
    registries: 'src/assets/registries',
  },
} satisfies ReplayableAssetsConfigInput;
