import { animate } from '@replayablejs/tween';

const durationSeconds = 32 / 60;
const framesPerSecond = 20;
const frameCount = 12;
const columns = 4;
const rows = 3;

/** The final sampled frame lands at the end of the animation. */
export function playThumbsUpAnimation(element: HTMLElement) {
  let currentFrame = -1;
  renderFrame(0);

  return animate(0, durationSeconds, {
    duration: durationSeconds,
    ease: 'linear',
    onUpdate: renderFrame,
  });

  function renderFrame(time: number): void {
    const frame =
      time >= durationSeconds
        ? frameCount - 1
        : Math.min(frameCount - 2, Math.floor(time * framesPerSecond));
    if (frame === currentFrame) {
      return;
    }
    currentFrame = frame;

    const x = ((frame % columns) / (columns - 1)) * 100;
    const y = (Math.floor(frame / columns) / (rows - 1)) * 100;
    element.style.backgroundPosition = `${x}% ${y}%`;
  }
}
