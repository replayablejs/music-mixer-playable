export type EndCardOutcome = 'success' | 'timeout';

export interface EndCardView {
  container: HTMLElement;
  show(): void;
  destroy(): void;
}

export interface EndCard {
  container: HTMLElement;
  show(outcome: EndCardOutcome): void;
  destroy(): void;
}
