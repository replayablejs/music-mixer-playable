export interface Celebration {
  container: HTMLElement;
  play(onComplete: () => void): void;
  destroy(): void;
}
