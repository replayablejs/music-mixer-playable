import { playable } from '@replayablejs/runtime';

import { sounds } from '#registries';

const packs = {
  liquiddnb: {
    prefix: 'liquiddnb',
    // Match First Light's mix loudness while retaining headroom for summed voices.
    volume: 0.32,
    loopDuration: 5.485714285714286,
    pulsesPerLoop: 8,
    fxDurations: [3.00444444444445, 4.17687074829932, 2.7418820861678, 5.4854648526077],
  },
  firstLight: {
    prefix: 'firstlight',
    volume: 1,
    loopDuration: 15,
    pulsesPerLoop: 32,
    fxDurations: [2, 1.5, 3.75, 1.875],
  },
};

export const soundPack =
  playable.config.params.soundPack === 'first-light' ? packs.firstLight : packs.liquiddnb;

/** Resolve the stable pad ID through the selected build's generated sound registry. */
export function getPackSound(padId: string): string {
  const registry: Readonly<Record<string, string>> = sounds;
  const id = `${soundPack.prefix}_${padId}`;
  const sound = registry[id];

  if (playable.config.audio && !sound) {
    throw new Error(`Missing sound ${id} in the selected pack.`);
  }

  // Audio-disabled variants can omit sound assets; their audio facade is a no-op.
  return sound ?? id;
}
