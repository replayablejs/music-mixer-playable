export interface Tooltip {
  container: HTMLElement;
  show(text: string): void;
  dismiss(): void;
  destroy(): void;
}
