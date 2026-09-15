import type { TweenPlaybackControls } from '@replayablejs/tween';

export interface Pulse {
  element: HTMLElement;
  animation?: TweenPlaybackControls;
}

export interface LoopTiming {
  position: number;
  duration: number;
}
