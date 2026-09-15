import type { ReplayableScreenInput } from '@replayablejs/config';

export default {
  orientations: {
    portrait: {
      enabled: true,
      width: 640,
      height: 960,
      ratio: { min: 0.4, max: 1 },
    },
    landscape: {
      enabled: true,
      width: 960,
      height: 640,
      ratio: { min: 1, max: 2.5 },
    },
  },
  resolution: {
    pixelRatio: { min: 1, max: 2 },
    renderScale: { minimal: 0.5, reduced: 0.65, balanced: 0.85, full: 1 },
  },
} satisfies ReplayableScreenInput;
