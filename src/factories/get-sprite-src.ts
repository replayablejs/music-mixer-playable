import { playable } from '@replayablejs/runtime';

import type { SpriteId } from '#types/sprite';

/** Returns the source URL of a sprite already loaded by Replayable. */
export function getSpriteSrc(id: SpriteId): string {
  const source = playable.loader.cache.sprites?.[id];
  if (!(source instanceof HTMLImageElement)) {
    throw new Error(`Sprite "${id}" has not been loaded as a DOM image.`);
  }

  return source.src;
}
