import type { PadGroup } from '#types/pad-group';

/** Stable pad identities, family membership, and layout coordinates. */
export const padGroups: PadGroup[] = [
  {
    id: 'beat',
    loop: true,
    labels: ['Beat', 'Beat', 'Beat', 'Beat'],
    compact: [2, 4],
    column: 0,
    row: 0,
  },
  {
    id: 'bass',
    loop: true,
    labels: ['Bass', 'Bass', 'Bass', 'Bass'],
    compact: [1, 4],
    column: 0,
    row: 1,
  },
  {
    id: 'arp',
    loop: true,
    labels: ['Arp', 'Arp', 'Lead', 'Lead'],
    compact: [1, 4],
    column: 1,
    row: 0,
  },
  {
    id: 'keys',
    loop: true,
    labels: ['Chords', 'Pad', 'Piano', 'Keys'],
    compact: [1, 3],
    column: 1,
    row: 2,
  },
  {
    id: 'vox',
    loop: true,
    labels: ['Choir', 'Vox', 'Vox', 'Vox'],
    compact: [],
    column: 1,
    row: 1,
  },
  {
    id: 'fx',
    loop: false,
    labels: ['Crash', 'Bass', 'Fx', 'Fx'],
    compact: [],
    column: 0,
    row: 2,
  },
];
