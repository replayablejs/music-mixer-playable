import type { LoopTiming } from '#types/speaker';

export interface Mixer {
  container: HTMLElement;
  expand(animated?: boolean): void;
  setPadGlow(id: string, visible: boolean, onPulse?: (intensity: number) => void): void;
  getPadElement(id: string): HTMLElement | undefined;
  getLoopTiming(this: void): LoopTiming | undefined;
  deactivate(): void;
  destroy(): void;
}
