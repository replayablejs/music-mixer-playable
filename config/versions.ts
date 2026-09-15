import type { ReplayableConfigInput } from '@replayablejs/config';

export default {
  liquiddnb: {
    params: { soundPack: 'liquiddnb', tutorial: true },
    assets: { exclude: ['sounds/firstlight_*'] },
  },
  'first-light': {
    params: { soundPack: 'first-light', tutorial: true },
    assets: { exclude: ['sounds/liquiddnb_*'] },
  },
  'liquiddnb-no-tutorial': {
    params: { soundPack: 'liquiddnb', tutorial: false },
    assets: { bundles: {}, exclude: ['sounds/firstlight_*', 'sprites/thumbs-up-spritesheet.png'] },
  },
  'first-light-no-tutorial': {
    params: { soundPack: 'first-light', tutorial: false },
    assets: { bundles: {}, exclude: ['sounds/liquiddnb_*', 'sprites/thumbs-up-spritesheet.png'] },
  },
} satisfies ReplayableConfigInput['versions'];
