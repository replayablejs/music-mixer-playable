import type { ReplayableParamsInput } from '@replayablejs/config';

export default {
  soundPack: {
    type: 'string',
    default: 'liquiddnb',
    options: ['liquiddnb', 'first-light'],
    description: 'Music pack included in this playable build.',
  },
  hint: {
    type: 'boolean',
    default: true,
    description: 'Show a hand after a period without interaction.',
  },
  hintDelaySeconds: {
    type: 'number',
    default: 2,
    range: { min: 0.5, max: 10, step: 0.5 },
    when: { param: 'hint', equals: true },
    description: 'Seconds without interaction before showing the hint.',
  },
  tutorial: {
    type: 'boolean',
    default: true,
    description: 'Guide the player through the compact mixer before expanding.',
  },
} satisfies ReplayableParamsInput;
