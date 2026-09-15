import { playable } from '@replayablejs/runtime';

import { h } from '#jsx';

import './persistent-cta.css';

export function createPersistentCta() {
  if (!playable.config.controls.persistentCta) {
    return undefined;
  }

  const container = (
    <button
      class="persistent-cta"
      type="button"
      onpointerup={openStore}
      onpointerdown={stopSceneInput}
    >
      {playable.localization.translate('downloadNow')}
    </button>
  );

  return { container, destroy };

  function openStore(event: PointerEvent): void {
    if (event.isPrimary && event.button === 0) {
      playable.openStore();
    }
  }

  // A store action must not also advance the tutorial underneath it.
  function stopSceneInput(event: PointerEvent): void {
    event.stopPropagation();
  }

  function destroy(): void {
    container.removeEventListener('pointerup', openStore);
    container.removeEventListener('pointerdown', stopSceneInput);
    container.remove();
  }
}
