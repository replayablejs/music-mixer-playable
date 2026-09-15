import { playable } from '@replayablejs/runtime';
import { animate, type TweenPlaybackControls } from '@replayablejs/tween';

import { h } from '#jsx';
import type { EndCardView } from '#types/end-card';

import { createAlarmClock } from '../../features/alarm-clock/create-alarm-clock';
import { createEndCardFrame } from './create-end-card-frame';
import { endCardContentDelay } from './end-card';

import './timeout-end-card.css';

const iconEntranceDurationSeconds = 0.4;
const titleEntranceDurationSeconds = 0.5;
const titleFadeDurationSeconds = 1;

export function createTimeoutEndCard(background: HTMLElement): EndCardView {
  const title = <h2 class="end-card-title">{playable.localization.translate('timeoutTitle')}</h2>;
  const icon = <div class="end-card-icon">{createAlarmClock()}</div>;
  const content = (
    <div class="end-card-content timeout-end-card">
      {title}
      {icon}
    </div>
  );

  const frame = createEndCardFrame(content, background);

  let animations: TweenPlaybackControls[] = [];

  return { container: frame.container, show, destroy };

  function show(): void {
    frame.show();

    animations = [
      animate(
        icon,
        { scale: [0.4, 1], opacity: [1, 1] },
        { duration: iconEntranceDurationSeconds, delay: endCardContentDelay, ease: 'backOut' },
      ),
      animate(
        title,
        { opacity: [0, 1], y: ['-2em', '0em'] },
        {
          y: {
            duration: titleEntranceDurationSeconds,
            delay: endCardContentDelay,
            ease: 'backOut',
          },
          opacity: {
            duration: titleFadeDurationSeconds,
            delay: endCardContentDelay,
            ease: 'backOut',
          },
        },
      ),
    ];
  }

  function destroy(): void {
    for (const animation of animations) {
      animation.stop();
    }
    frame.destroy();
  }
}
