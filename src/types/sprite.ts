import type { sprites } from '#registries';

export type SpriteId = (typeof sprites)[keyof typeof sprites];
