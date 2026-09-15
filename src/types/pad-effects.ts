export interface PadParticles {
  container: HTMLElement;
  randomize(): void;
  setProgress(progress: number): void;
  destroy(): void;
}

export interface PadGlowEffect {
  show(onPulse?: (intensity: number) => void): void;
  hide(): void;
  destroy(): void;
}
