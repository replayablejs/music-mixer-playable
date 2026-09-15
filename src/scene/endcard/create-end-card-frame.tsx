import { playable } from '@replayablejs/runtime';
import { animate, type TweenPlaybackControls } from '@replayablejs/tween';

import { h } from '#jsx';

import { endCardContentDelay } from './end-card';

import './end-card.css';

const backgroundFadeDurationSeconds = 0.6;
const contentFadeDurationSeconds = 0.1;
const actionEntranceDurationSeconds = 0.5;
const buttonPulseDurationSeconds = 1.2;
const buttonPulseDelaySeconds = 1;
const buttonPulseScale = 1.03;

/** Shared safe area, CTA, and network-aware store interaction. */
export function createEndCardFrame(content: HTMLElement, background: HTMLElement) {
  const button = (
    <button class="end-card-button" type="button">
      {playable.localization.translate('keepGroovin')}
    </button>
  );
  const action = <div class="end-card-action">{button}</div>;
  const container = (
    <section class="end-card" hidden aria-label="Endcard" onpointerup={handlePointerUp}>
      <div class="end-card-safe">{content}</div>
    </section>
  );

  let animations: TweenPlaybackControls[] = [];

  content.append(action);

  return { container, show, destroy };

  function show(): void {
    container.hidden = false;
    const theme = getComputedStyle(background);

    animations = [
      animate(
        background,
        {
          '--background-top': theme.getPropertyValue('--endcard-background-top').trim(),
          '--background-bottom': theme.getPropertyValue('--endcard-background-bottom').trim(),
        },
        { duration: backgroundFadeDurationSeconds, ease: 'easeInOut' },
      ),
      animate(
        content,
        { opacity: [0, 1] },
        { duration: contentFadeDurationSeconds, delay: endCardContentDelay },
      ),
      animate(
        action,
        { y: ['100em', '0em'], opacity: [0, 1] },
        { duration: actionEntranceDurationSeconds, delay: endCardContentDelay, ease: 'backOut' },
      ),
      animate(
        button,
        { scale: [1, buttonPulseScale] },
        {
          duration: buttonPulseDurationSeconds,
          delay: buttonPulseDelaySeconds + endCardContentDelay,
          ease: 'easeInOut',
          repeatType: 'reverse',
          repeat: playable.config.endCard.animation === 'continuous' ? Infinity : 1,
        },
      ),
    ];
  }

  function destroy(): void {
    for (const animation of animations) {
      animation.stop();
    }
    container.removeEventListener('pointerup', handlePointerUp);
    container.remove();
  }

  function handlePointerUp(event: PointerEvent): void {
    if (!event.isPrimary || event.button !== 0) {
      return;
    }

    event.stopPropagation();
    if (
      playable.config.endCard.interaction === 'cta-only' &&
      !event.composedPath().includes(button)
    ) {
      return;
    }

    playable.openStore();
  }
}
