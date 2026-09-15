import { playable } from '@replayablejs/runtime';
import { animate } from '@replayablejs/tween';

import { h } from '#jsx';
import type { Pulse, LoopTiming } from '#types/speaker';

import { soundPack } from '../audio/sound-pack';

const pulseDurationSeconds = 0.8;
const pulsesPerLoop = soundPack.pulsesPerLoop;
const maximumPulseScale = 2.4;
const viewportWidthLimit = 0.9;

export function createSpeakerPulses(container: HTMLElement) {
  const pool: Pulse[] = [];

  let removeUpdate: (() => void) | undefined;
  let nextPulseIndex = 0;

  return { start, stop, destroy };

  /** Follow the backend loop clock at the selected pack's pulse rate. */
  function start(getTiming: () => LoopTiming | undefined): void {
    if (removeUpdate) {
      return;
    }
    let previousBeat = -1;
    removeUpdate = playable.update.add(updatePulse);

    function updatePulse(): void {
      const timing = getTiming();
      if (!timing || timing.duration <= 0 || timing.position <= 0) {
        return;
      }

      const intervalSeconds = timing.duration / pulsesPerLoop;
      preparePool(Math.ceil(pulseDurationSeconds / intervalSeconds));

      const beat = Math.floor(timing.position / intervalSeconds) % pulsesPerLoop;
      if (beat !== previousBeat) {
        previousBeat = beat;
        emit();
      }
    }
  }

  function stop(): void {
    removeUpdate?.();
    removeUpdate = undefined;
    for (const pulse of pool) {
      pulse.animation?.cancel();
      pulse.animation = undefined;
      pulse.element.hidden = true;
    }
  }

  function destroy(): void {
    stop();
    for (const pulse of pool) {
      pulse.element.remove();
    }
    pool.length = 0;
  }

  function preparePool(count: number): void {
    while (pool.length < count) {
      const element = <span class="speaker-pulse" aria-hidden="true" hidden />;
      container.prepend(element);
      pool.push({ element });
    }
  }

  function emit(): void {
    // Limit pulse growth to the viewport without changing the layout.
    const diameter = container.getBoundingClientRect().width;
    const growth = Math.min(
      maximumPulseScale,
      (playable.screen.frame.width * viewportWidthLimit) / diameter,
    );

    const pulse = pool[nextPulseIndex];
    nextPulseIndex = (nextPulseIndex + 1) % pool.length;

    pulse.animation?.cancel();
    pulse.element.hidden = false;
    const animation = animate(
      pulse.element,
      { scale: [1, growth], opacity: [1 - 1 / growth, 0] },
      { duration: pulseDurationSeconds, ease: (t: number) => 1 - (1 - t) ** 2 },
    );
    pulse.animation = animation;
    void animation.then(() => {
      // A previous completion must not hide an element that has been reused.
      if (pulse.animation !== animation) {
        return;
      }
      pulse.animation = undefined;
      pulse.element.hidden = true;
    });
  }
}
