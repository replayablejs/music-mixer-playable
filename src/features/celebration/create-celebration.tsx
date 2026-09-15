import { playable } from '@replayablejs/runtime';
import { animate, type TweenPlaybackControls } from '@replayablejs/tween';

import { h } from '#jsx';
import { sprites } from '#registries';
import type { Celebration } from '#types/celebration';

import { getSpriteSrc } from '../../factories/get-sprite-src';
import { playThumbsUpAnimation } from './play-thumbs-up-animation';

import './celebration.css';

const labelEntranceDurationSeconds = 0.6;
const exitStartSeconds = 2;
const exitDurationSeconds = 0.25;
const exitScale = 0.92;

/** A visual sequence only; the caller decides what happens after it finishes. */
export function createCelebration(): Celebration {
  const hand = <div class="celebration-hand" aria-hidden="true" />;
  hand.style.backgroundImage = `url("${getSpriteSrc(sprites['thumbs-up-spritesheet'])}")`;
  const text = <span>{playable.localization.translate('goodJob')}</span>;
  const label = <div class="celebration-label">{text}</div>;
  const artwork = (
    <div class="celebration-artwork">
      {hand}
      {label}
    </div>
  );
  const container = (
    <div class="celebration" hidden>
      {artwork}
    </div>
  );

  let animation: TweenPlaybackControls | undefined;
  let handAnimation: TweenPlaybackControls | undefined;
  let started = false;
  let destroyed = false;

  const resizeObserver = new ResizeObserver(fitLabel);
  resizeObserver.observe(container);

  return { container, play, destroy };

  function play(onComplete: () => void): void {
    if (started || destroyed) {
      return;
    }

    started = true;
    container.hidden = false;
    fitLabel();
    handAnimation = playThumbsUpAnimation(hand);
    animation = animate([
      [
        label,
        { scale: [0, 1] },
        {
          at: 0,
          duration: labelEntranceDurationSeconds,
          ease: 'backOut',
        },
      ],
      [
        artwork,
        { opacity: [1, 0], scale: [1, exitScale] },
        {
          at: exitStartSeconds,
          duration: exitDurationSeconds,
          ease: 'easeOut',
        },
      ],
    ]);
    void animation.then(() => {
      if (!destroyed) {
        container.hidden = true;
        onComplete();
      }
    });
  }

  /** Measure untransformed text so the entrance animation cannot affect sizing. */
  function fitLabel(): void {
    if (container.hidden || label.clientWidth === 0) {
      return;
    }
    label.style.removeProperty('font-size');
    const fontSize = parseFloat(getComputedStyle(label).fontSize);
    if (text.scrollWidth > label.clientWidth) {
      label.style.fontSize = `${fontSize * (label.clientWidth / text.scrollWidth)}px`;
    }
  }

  function destroy(): void {
    destroyed = true;
    resizeObserver.disconnect();
    animation?.stop();
    handAnimation?.stop();
    container.remove();
  }
}
