export interface PadView {
  container: HTMLElement;
  compact: boolean;
}

export interface PadLayout {
  element: HTMLElement;
  bounds: DOMRect;
}

export interface PadLayoutChange {
  element: HTMLElement;
  compactBounds: DOMRect;
  expandedBounds: DOMRect;
}
