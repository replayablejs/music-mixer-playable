import { animate, type TweenPlaybackControls } from '@replayablejs/tween';

import { h } from '#jsx';

import { createLogo } from '../../features/logo/create-logo';
import { createPersistentCta } from '../../features/persistent-cta/create-persistent-cta';
import { createTooltip } from '../../features/tooltip/create-tooltip';

import './interface.css';

const fadeOutDurationSeconds = 0.25;

export function createInterface() {
  const logo = createLogo();
  const tooltip = createTooltip();
  const persistentCta = createPersistentCta();

  const header = (
    <div class="scene-header">
      {logo.container}
      <div class="tooltip-slot">{tooltip.container}</div>
    </div>
  );
  const container = (
    <div class="interface" hidden>
      {header}
      {persistentCta?.container}
    </div>
  );

  let hideAnimation: TweenPlaybackControls | undefined;
  let hidePromise: Promise<void> | undefined;
  let destroyed = false;

  return { container, tooltip, show, hide, destroy };

  function show(): void {
    if (destroyed || hidePromise) {
      return;
    }

    container.hidden = false;
  }

  function hide(): Promise<void> {
    if (destroyed) {
      return Promise.resolve();
    }
    if (hidePromise) {
      return hidePromise;
    }

    container.inert = true;

    // The interface uses display: contents, so fade its rendered grid children.
    const targets = persistentCta ? [header, persistentCta.container] : [header];
    hideAnimation = animate(
      targets,
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
    hideAnimation?.stop();
    persistentCta?.destroy();
    logo.destroy();
    tooltip.destroy();
    container.remove();
  }

  function finishHide(): void {
    if (destroyed) {
      return;
    }

    container.hidden = true;
    tooltip.dismiss();
  }
}
