import { playable } from '@replayablejs/runtime';

import { h } from '#jsx';
import type { Celebration } from '#types/celebration';
import type { GameModel } from '#types/game-model';
import type { Tooltip } from '#types/tooltip';

import { createCelebration } from '../../features/celebration/create-celebration';
import { createSpeaker } from '../../features/speaker/create-speaker';
import { createGameplay } from './create-gameplay';

export function createCompactGameplay(model: GameModel, tooltip: Tooltip) {
  const gameplay = createGameplay(model);
  const { mixer, layout } = gameplay;
  const speaker = createSpeaker();
  const speakerSpace = <div class="speaker-space">{speaker.container}</div>;

  let celebration: Celebration | undefined;
  let finishCelebration: ((completed: boolean) => void) | undefined;
  let expansionPromise: Promise<boolean> | undefined;
  let dismissEffectsMessage: (() => void) | undefined;

  layout.prepend(speakerSpace);
  const unsubscribeSpeaker = model.onSelectionChange(updateSpeaker);

  return { ...gameplay, expand, hide, destroy };

  function expand(): Promise<boolean> {
    if (model.completed) {
      return Promise.resolve(false);
    }
    expansionPromise ??= playExpansion();
    return expansionPromise;
  }

  async function hide(): Promise<void> {
    deactivate();
    await gameplay.hide();
    releaseSpeaker();
  }

  function destroy(): void {
    deactivate();
    releaseSpeaker();
    gameplay.destroy();
  }

  function updateSpeaker(): void {
    if (model.hasActiveLoops()) {
      speaker.start(mixer.getLoopTiming);
    } else {
      speaker.stop();
    }
  }

  async function playExpansion(): Promise<boolean> {
    mixer.container.inert = true;

    const celebrated = await celebrate();
    if (!celebrated || model.completed) {
      return false;
    }

    // Measure the mounted compact layout before removing the speaker.
    mixer.expand(true);
    releaseSpeaker();
    mixer.container.inert = false;

    return showEffectsMessage();
  }

  function celebrate(): Promise<boolean> {
    deactivate();
    speaker.container.hidden = true;

    celebration = createCelebration();
    speakerSpace.append(celebration.container);

    const { promise, resolve } = Promise.withResolvers<boolean>();
    finishCelebration = resolve;
    celebration.play(() => {
      finishCelebration = undefined;
      resolve(true);
    });
    return promise;
  }

  function showEffectsMessage(): Promise<boolean> {
    dismissEffectsMessage?.();
    tooltip.show(playable.localization.translate('tutorialAddEffects'));

    const { promise, resolve } = Promise.withResolvers<boolean>();
    let elapsed = 0;
    const unsubscribeUpdate = playable.update.add(({ deltaSeconds }) => {
      elapsed += deltaSeconds;
      if (elapsed >= 4) {
        finish();
      }
    });
    playable.container.addEventListener('pointerup', handleInteraction);
    dismissEffectsMessage = () => finish(false);
    return promise;

    function handleInteraction(event: PointerEvent): void {
      if (event.isPrimary && event.button === 0 && elapsed >= 0.6) {
        finish();
      }
    }

    function finish(completed = true): void {
      cleanup();
      resolve(completed);
    }

    function cleanup(): void {
      unsubscribeUpdate();
      playable.container.removeEventListener('pointerup', handleInteraction);
      tooltip.dismiss();
      dismissEffectsMessage = undefined;
    }
  }

  function deactivate(): void {
    dismissEffectsMessage?.();
    finishCelebration?.(false);
    finishCelebration = undefined;
    unsubscribeSpeaker();
    speaker.stop();
  }

  function releaseSpeaker(): void {
    celebration?.destroy();
    celebration = undefined;
    speaker.destroy();
    speakerSpace.remove();
  }
}
