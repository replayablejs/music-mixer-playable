import { animate, type TweenPlaybackControls } from '@replayablejs/tween';

import type { PadGlowEffect } from '#types/pad-effects';
import type { PadParticles } from '#types/pad-effects';

import { createPadGlow } from './create-pad-glow';

const cycleDurationSeconds = 1.4;
const fadeDurationSeconds = 0.6;

/** One Replayable timeline keeps the glow and particles in phase. */
export function createPadGlowEffect(pad: HTMLElement, particles: PadParticles): PadGlowEffect {
  const glow = createPadGlow(pad);

  let animation: TweenPlaybackControls | undefined;
  let cycleProgress = 0;
  let glowOpacity = 0;
  let showing = false;
  let onPulse: ((intensity: number) => void) | undefined;

  return { show, hide, destroy };

  function show(updatePulse?: (intensity: number) => void): void {
    onPulse = updatePulse;
    if (showing) {
      return;
    }

    showing = true;
    animation?.stop();

    particles.randomize();
    cycleProgress = 0;
    particles.container.hidden = false;
    renderCycle(0);

    animation = animate(0, 1, {
      duration: cycleDurationSeconds,
      ease: 'linear',
      repeat: Infinity,
      onUpdate: renderCycle,
    });
  }

  function hide(): void {
    if (!showing) {
      return;
    }

    showing = false;
    onPulse = undefined;
    animation?.stop();

    const startProgress = cycleProgress;
    const startOpacity = glowOpacity;
    const duration = Math.max(fadeDurationSeconds, (1 - cycleProgress) * cycleDurationSeconds);

    animation = animate(0, duration, {
      duration,
      ease: 'linear',
      onUpdate: renderExit,
    });

    function renderExit(elapsed: number): void {
      const particleProgress = Math.min(1, startProgress + elapsed / cycleDurationSeconds);
      glowOpacity = startOpacity * (1 - Math.min(1, elapsed / fadeDurationSeconds)) ** 3;
      glow.setOpacity(glowOpacity);
      particles.setProgress(particleProgress);
      particles.container.hidden = particleProgress === 1;
    }
  }

  function destroy(): void {
    animation?.stop();
    glow.destroy();
    particles.destroy();
  }

  function renderCycle(value: number): void {
    // The shared timeline wrapped: vary the next cycle without restarting it.
    if (value < cycleProgress) {
      particles.randomize();
    }
    cycleProgress = value;
    glowOpacity = value < 0.5 ? 1 - (1 - value * 2) ** 3 : (2 - value * 2) ** 3;
    glow.setOpacity(glowOpacity);
    particles.setProgress(value);
    onPulse?.(glowOpacity);
  }
}
