import { playable } from '@replayablejs/runtime';

import type { GameModel } from '#types/game-model';
import type { Mixer } from '#types/mixer';
import type { Tooltip } from '#types/tooltip';

import { createHandIndicator } from '../hand-indicator/create-hand-indicator';

const guidedPadIds = ['beat_2', 'arp_1', 'bass_4', 'keys_3'];
const guidanceDelaySeconds = 1;

/** Owns guided selection only. Ongoing idle hints are a separate feature. */
export function createTutorial(
  model: GameModel,
  mixer: Mixer,
  tooltip: Tooltip,
  onComplete: () => void,
) {
  const hand = createHandIndicator();

  let stage: 'ready' | 'pads' | 'complete' = 'ready';
  let targetPadId: string | undefined;
  let targetElapsedSeconds = 0;
  let removeSelection: (() => void) | undefined;
  let removeUpdate: (() => void) | undefined;

  return { start, destroy };

  function start(): void {
    if (stage !== 'ready') {
      return;
    }

    stage = 'pads';
    tooltip.show(playable.localization.translate('tutorialMakeBeat'));
    chooseTarget();
    removeSelection = model.onSelectionChange(handleSelection);
    removeUpdate = playable.update.add(update);
  }

  function destroy(): void {
    stage = 'complete';
    cleanup();
  }

  function handleSelection(): void {
    if (stage !== 'pads') {
      return;
    }

    // Any activation dismisses the opening message, including a non-target pad.
    if (model.hasSelection()) {
      tooltip.dismiss();
    }

    chooseTarget();
    if (!targetPadId) {
      finish();
    }
  }

  function chooseTarget(): void {
    if (targetPadId) {
      mixer.setPadGlow(targetPadId, false);
    }
    hand.hide();
    targetPadId = guidedPadIds.find((id) => !model.isSelected(id));
    targetElapsedSeconds = 0;
  }

  function update({ deltaSeconds }: { deltaSeconds: number }): void {
    if (stage !== 'pads' || !targetPadId) {
      return;
    }
    const previousElapsed = targetElapsedSeconds;
    targetElapsedSeconds += deltaSeconds;
    if (previousElapsed < guidanceDelaySeconds && targetElapsedSeconds >= guidanceDelaySeconds) {
      showGuidance();
    }
  }

  function showGuidance(): void {
    if (!targetPadId) {
      return;
    }
    const element = mixer.getPadElement(targetPadId);
    if (element) {
      hand.show(element);
      mixer.setPadGlow(targetPadId, true, hand.setPress);
    }
  }

  function finish(): void {
    stage = 'complete';
    tooltip.dismiss();
    cleanup();
    onComplete();
  }

  function cleanup(): void {
    hand.hide();
    if (targetPadId) {
      mixer.setPadGlow(targetPadId, false);
      targetPadId = undefined;
    }
    removeSelection?.();
    removeUpdate?.();
  }
}
