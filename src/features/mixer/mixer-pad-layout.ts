import { mixerPads } from './config/mixer-pads';

/** CSS grid coordinates are one-based; each pad keeps its identity across layouts. */
export const mixerPadLayouts = new Map<string, string>(
  mixerPads.map((pad) => {
    const { familyIndex, index, compactIndex, column, row } = pad.placement;

    const style = [
      `--compact-column:${familyIndex + 1}`,
      `--compact-row:${compactIndex + 1}`,
      `--compact-landscape-column:${(familyIndex % 2) * 2 + compactIndex + 1}`,
      `--compact-landscape-row:${Math.floor(familyIndex / 2) + 1}`,
      `--expanded-column:${column * 3 + Math.floor(index / 2) + 1}`,
      `--expanded-row:${row * 2 + (index % 2) + 1}`,
      `--expanded-landscape-column:${column * 5 + index + 1}`,
      `--expanded-landscape-row:${row + 1}`,
    ].join(';');
    return [pad.id, style];
  }),
);
