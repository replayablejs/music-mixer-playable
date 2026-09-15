import { animate, stagger } from '@replayablejs/tween';

import type { PadView, PadLayout, PadLayoutChange } from '#types/mixer-layout';

const expansionDurationSeconds = 0.6;
const appearanceDurationSeconds = 0.3;
const appearanceDelaySeconds = 0.2;
const rowStaggerSeconds = 0.03;
const appearanceStartScale = 0.9;

/** Measure before and after the CSS layout change, then animate both pad groups. */
export function animateMixerExpansion(grid: HTMLElement, pads: PadView[]) {
  const compactPads = pads
    .filter((pad) => pad.compact)
    .map((pad) => ({
      element: pad.container,
      compactBounds: pad.container.getBoundingClientRect(),
    }));

  grid.dataset.mode = 'expanded';
  for (const pad of pads) {
    pad.container.hidden = false;
  }

  // Finish all measurements before animation writes any transforms.
  const layoutChanges = compactPads.map((pad) => ({
    ...pad,
    expandedBounds: pad.element.getBoundingClientRect(),
  }));
  const appearingPads = pads
    .filter((pad) => !pad.compact)
    .map((pad) => ({
      element: pad.container,
      bounds: pad.container.getBoundingClientRect(),
    }));

  return [...animatePadLayoutChanges(layoutChanges), animatePadsAppearance(appearingPads)];
}

function animatePadLayoutChanges(pads: PadLayoutChange[]) {
  return pads.map(({ element, compactBounds, expandedBounds }) => {
    const compactCenterX = compactBounds.left + compactBounds.width / 2;
    const compactCenterY = compactBounds.top + compactBounds.height / 2;
    const expandedCenterX = expandedBounds.left + expandedBounds.width / 2;
    const expandedCenterY = expandedBounds.top + expandedBounds.height / 2;

    const centerOffsetX = compactCenterX - expandedCenterX;
    const centerOffsetY = compactCenterY - expandedCenterY;
    const sizeRatio = compactBounds.width / expandedBounds.width;

    const compactTransform = `translate(${centerOffsetX}px, ${centerOffsetY}px) scale(${sizeRatio})`;
    // Apply the starting pose now; Motion can initialize on the next frame.
    element.style.transform = compactTransform;

    return animate(
      element,
      { transform: [compactTransform, 'translate(0px, 0px) scale(1)'] },
      { duration: expansionDurationSeconds, ease: [0.22, 1, 0.36, 1] },
    );
  });
}

function animatePadsAppearance(pads: PadLayout[]) {
  // Use visual rows, not asset order, in either orientation.
  const rows = [...new Set(pads.map(({ bounds }) => bounds.top))].sort((a, b) => a - b);
  const rowDelay = stagger(rowStaggerSeconds, {
    startDelay: appearanceDelaySeconds,
  });

  const startTransform = `scale(${appearanceStartScale})`;

  // Keep new pads invisible before the staggered animations are initialized.
  for (const { element } of pads) {
    element.style.opacity = '0';
    element.style.transform = startTransform;
  }

  return animate(
    pads.map(({ element }) => element),
    { opacity: [0, 1], transform: [startTransform, 'scale(1)'] },
    {
      duration: appearanceDurationSeconds,
      delay: (index) => rowDelay(rows.indexOf(pads[index].bounds.top), rows.length),
      ease: 'easeOut',
    },
  );
}
