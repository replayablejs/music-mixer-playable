import { animate, type TweenPlaybackControls } from '@replayablejs/tween';

import { h } from '#jsx';
import type { GameModel } from '#types/game-model';

import { createMixer } from '../../features/mixer/create-mixer';

const fadeOutDurationSeconds = 0.25;

export function createGameplay(model: GameModel) {
  const container = <div class="gameplay" hidden />;
  const mixer = createMixer(model);
  const layout = <div class="gameplay-layout">{mixer.container}</div>;

  let hideAnimation: TweenPlaybackControls | undefined;
  let hidePromise: Promise<void> | undefined;
  let destroyed = false;

  container.append(layout);

  return { container, layout, mixer, show, hide, destroy };

  function show(): void {
    if (model.completed) {
      return;
    }

    container.hidden = false;
  }

  function hide(): Promise<void> {
    if (hidePromise) {
      return hidePromise;
    }
    if (destroyed) {
      return Promise.resolve();
    }

    model.complete();
    container.inert = true;
    mixer.deactivate();

    hideAnimation = animate(
      container,
      { opacity: [1, 0] },
      { duration: fadeOutDurationSeconds, ease: 'easeOut' },
    );
    hidePromise = hideAnimation.then(finishHide);

    return hidePromise;
  }

  function destroy(): void {
    if (destroyed) {
      return;
    }

    destroyed = true;
    model.complete();
    hideAnimation?.stop();
    mixer.destroy();
    container.remove();
  }

  function finishHide(): void {
    if (destroyed) {
      return;
    }

    container.hidden = true;
  }
}
