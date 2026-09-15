import { animate, type TweenPlaybackControls } from '@replayablejs/tween';

import { h } from '#jsx';
import { sprites } from '#registries';

import { getSpriteSrc } from '../../factories/get-sprite-src';

import './hand-indicator.css';

const entranceDurationSeconds = 0.25;
const pressScaleReduction = 0.2;

/** Attach to the target so CSS keeps the fingertip aligned across resizes. */
export function createHandIndicator() {
  const container = (
    <img class="hand-indicator" src={getSpriteSrc(sprites.hand)} alt="" aria-hidden="true" />
  );

  let entranceAnimation: TweenPlaybackControls | undefined;

  return { show, hide, setPress };

  function show(target: HTMLElement): void {
    if (container.parentElement === target) {
      return;
    }

    hide();
    container.style.opacity = '0';
    target.append(container);

    entranceAnimation = animate(
      container,
      { opacity: [0, 1] },
      { duration: entranceDurationSeconds, ease: 'easeOut' },
    );
  }

  function hide(): void {
    entranceAnimation?.cancel();
    entranceAnimation = undefined;
    container.remove();
  }

  /** Use the pulse supplied by tutorial or hints to animate the press. */
  function setPress(intensity: number): void {
    container.style.transform = `scale(${1 - pressScaleReduction * intensity})`;
  }
}
