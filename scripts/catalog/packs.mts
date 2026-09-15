import type { PackDescription } from './types.mts';

export const packs: Record<string, PackDescription> = {
  liquiddnb: {
    name: 'Liquid DnB · Guided',
    description:
      'Fast drum-and-bass loops with purple and pink visuals. Start with eight pads, follow the tutorial, then unlock the full mixer.',
  },
  'first-light': {
    name: 'First Light · Guided',
    description:
      'Original synthesized loops at 128 BPM in A minor. Navy, amber, and coral visuals, with a guided introduction before the full mixer.',
  },
  'liquiddnb-no-tutorial': {
    name: 'Liquid DnB · Free play',
    description:
      'The same drum-and-bass pack with all 24 pads available immediately. No tutorial or thumbs-up celebration; idle hints remain enabled.',
  },
  'first-light-no-tutorial': {
    name: 'First Light · Free play',
    description:
      'The same synthesized pack with all 24 pads available immediately. No tutorial or thumbs-up celebration; idle hints remain enabled.',
  },
};
