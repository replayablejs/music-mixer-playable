import { playable } from '@replayablejs/runtime';
import { animate, type TweenPlaybackControls } from '@replayablejs/tween';

import type { GameModel } from '#types/game-model';
import type { Mixer } from '#types/mixer';

import { createHandIndicator } from '../hand-indicator/create-hand-indicator';
import { mixerPads } from '../mixer/config/mixer-pads';
import { padGroups } from '../mixer/config/pads-config';

const pressDurationSeconds = 0.5;

/** Idle guidance is independent of tutorial progression and pad effects. */
export function createHint(model: GameModel, mixer: Mixer) {
  const hand = createHandIndicator();
  const idleTimer = playable.timers.createInactivityTimer({
    duration: Number(playable.config.params.hintDelaySeconds),
    onTimeout: show,
  });

  let started = false;
  let destroyed = false;
  let pulse: TweenPlaybackControls | undefined;
  let removeResize: (() => void) | undefined;

  // Observe selection before start too: tutorial completion must not revive a finished hint.
  const removeSelection = model.onSelectionChange(handleSelection);

  return { start, destroy };

  function start(): void {
    if (started || destroyed) {
      return;
    }
    if (model.hasAllGroupsSelected()) {
      destroy();
      return;
    }

    started = true;
    idleTimer.start();
    removeResize = playable.on('resize', reset);
    playable.container.addEventListener('pointerup', handleInteraction);
  }

  function destroy(): void {
    if (destroyed) {
      return;
    }

    destroyed = true;
    reset();
    idleTimer.stop();
    removeSelection();
    removeResize?.();
    playable.container.removeEventListener('pointerup', handleInteraction);
  }

  function handleSelection(): void {
    if (model.hasAllGroupsSelected()) {
      destroy();
    } else if (started) {
      reset();
    }
  }

  function handleInteraction(event: PointerEvent): void {
    if (event.isPrimary && event.button === 0) {
      reset();
    }
  }

  function show(): void {
    const target = findTarget();
    if (!target) {
      return;
    }

    hand.setPress(0);
    hand.show(target);
    pulse = animate(0, 1, {
      duration: pressDurationSeconds,
      ease: 'easeOut',
      repeat: Infinity,
      repeatType: 'reverse',
      onUpdate: hand.setPress,
    });
  }

  function findTarget(): HTMLElement | undefined {
    // Preserve family order; choose a variation only within the first inactive family.
    const family = padGroups.find(
      (group) => !mixerPads.some((pad) => pad.family === group.id && model.isSelected(pad.id)),
    );
    if (!family) {
      return undefined;
    }
    const candidates = mixerPads.filter((pad) => pad.family === family.id);
    const pad = candidates[Math.floor(Math.random() * candidates.length)];
    return mixer.getPadElement(pad.id);
  }

  function reset(): void {
    pulse?.cancel();
    pulse = undefined;
    hand.hide();
    if (started && !destroyed) {
      idleTimer.restart();
    }
  }
}
