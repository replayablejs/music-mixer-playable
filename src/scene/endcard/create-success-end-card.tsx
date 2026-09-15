import { playable } from '@replayablejs/runtime';
import { animate, type TweenPlaybackControls } from '@replayablejs/tween';

import { h } from '#jsx';
import type { EndCardView } from '#types/end-card';

import { createAppIcon } from '../../features/app-icon/create-app-icon';
import { createEndCardFrame } from './create-end-card-frame';
import { endCardContentDelay } from './end-card';

import './success-end-card.css';

const entranceDurationSeconds = 0.5;

export function createSuccessEndCard(background: HTMLElement): EndCardView {
  const icon = <div class="end-card-icon">{createAppIcon()}</div>;
  const title = <h2 class="end-card-title">{playable.localization.translate('successTitle')}</h2>;
  const subtitle = (
    <p class="success-end-card-subtitle">{playable.localization.translate('successMessage')}</p>
  );
  const content = (
    <div class="end-card-content success-end-card">
      {icon}
      {title}
      {subtitle}
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
        { y: ['-100em', '0em'], opacity: [1, 1] },
        {
          duration: entranceDurationSeconds,
          delay: endCardContentDelay,
          ease: 'backOut',
        },
      ),
      animate(
        [title, subtitle],
        { opacity: [0, 1] },
        {
          duration: entranceDurationSeconds,
          delay: endCardContentDelay,
          ease: 'backOut',
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
