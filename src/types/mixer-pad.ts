import type { PadGlowEffect } from '#types/pad-effects';

import type { mixerPads } from '../features/mixer/config/mixer-pads';

export type MixerPadDefinition = (typeof mixerPads)[number];

export interface MixerPadView {
  container: HTMLElement;
  compact: boolean;
  select(): void;
  deselect(): void;
  setProgress(value: number): void;
  glowEffect: PadGlowEffect;
  destroy(): void;
}

export interface MixerPad {
  definition: MixerPadDefinition;
  view: MixerPadView;
}
