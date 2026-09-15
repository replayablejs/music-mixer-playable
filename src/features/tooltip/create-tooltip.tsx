import { animate, type TweenPlaybackControls } from '@replayablejs/tween';

import { h } from '#jsx';
import type { Tooltip } from '#types/tooltip';

import './tooltip.css';

const entranceDelaySeconds = 0.3;
const animationDurationSeconds = 0.3;
const fontFitIterations = 8;

/** The caller owns the message and when it is dismissed. */
export function createTooltip(): Tooltip {
  const textContent = <span />;
  const label = <span class="tooltip-label">{textContent}</span>;
  const container = (
    <div class="tooltip" hidden>
      <div class="tooltip-artwork">{label}</div>
    </div>
  );

  let animation: TweenPlaybackControls | undefined;
  let visible = false;

  const resizeObserver = new ResizeObserver(fitText);
  resizeObserver.observe(label);

  return { container, show, dismiss, destroy };

  function show(text: string): void {
    animation?.cancel();
    textContent.textContent = text;
    visible = true;
    container.hidden = false;
    fitText();

    container.style.transform = 'scale(0)';
    animation = animate(
      container,
      { scale: [0, 1] },
      {
        delay: entranceDelaySeconds,
        duration: animationDurationSeconds,
        ease: 'backOut',
      },
    );
  }

  function dismiss(): void {
    if (!visible) {
      return;
    }

    visible = false;
    animation?.stop();
    const exit = animate(
      container,
      { scale: 0 },
      {
        duration: animationDurationSeconds,
        ease: 'backIn',
      },
    );
    animation = exit;
    void exit.then(() => {
      if (animation === exit) {
        container.hidden = true;
      }
    });
  }

  function destroy(): void {
    resizeObserver.disconnect();
    animation?.cancel();
    container.remove();
  }

  /** Let CSS wrap naturally, then find the largest font that fits the bubble. */
  function fitText(): void {
    if (container.hidden || label.clientWidth === 0) {
      return;
    }
    label.style.removeProperty('font-size');
    const style = getComputedStyle(label);
    const availableHeight = parseFloat(style.maxHeight);
    let maximumFontSize = parseFloat(style.fontSize);
    let minimumFontSize = 1;
    if (textFits()) {
      return;
    }
    for (let step = 0; step < fontFitIterations; step += 1) {
      const size = (minimumFontSize + maximumFontSize) / 2;
      label.style.fontSize = `${size}px`;
      if (textFits()) {
        minimumFontSize = size;
      } else {
        maximumFontSize = size;
      }
    }
    label.style.fontSize = `${minimumFontSize}px`;

    function textFits(): boolean {
      return (
        textContent.scrollHeight <= availableHeight && textContent.scrollWidth <= label.clientWidth
      );
    }
  }
}
