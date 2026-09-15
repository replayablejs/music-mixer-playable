import { animate, type TweenPlaybackControls } from '@replayablejs/tween';

import { h } from '#jsx';
import type { MixerPadView } from '#types/mixer-pad';
import type { MixerPadDefinition } from '#types/mixer-pad';

import { mixerPadLayouts } from '../mixer-pad-layout';
import { createPadGlowEffect } from './effects/create-pad-glow-effect';
import { createPadParticles } from './effects/create-pad-particles';
import { createPadProgressBar } from './progress/create-pad-progress-bar';
import { createPadProgressRing } from './progress/create-pad-progress-ring';

import './mixer-pad.css';

const selectionDurationSeconds = 0.2;

export function createMixerPad(pad: MixerPadDefinition, onPress: () => void): MixerPadView {
  const particles = createPadParticles();
  const progress = pad.loop ? createPadProgressRing() : createPadProgressBar();
  const selection = <span class="mixer-pad-selection" aria-hidden="true" hidden />;

  const container = (
    <button
      type="button"
      aria-pressed="false"
      onpointerup={handlePointerUp}
      class="mixer-pad"
      data-pad={pad.id}
      data-family={pad.family}
      style={mixerPadLayouts.get(pad.id)}
      hidden={!pad.compact}
    >
      {selection}
      {particles.container}
      {progress.container}
      <span class="mixer-pad-label">{pad.label}</span>
    </button>
  );

  const glowEffect = createPadGlowEffect(container, particles);

  let selectionAnimation: TweenPlaybackControls | undefined;
  let selected = false;

  return {
    container,
    compact: pad.compact,
    select,
    deselect,
    setProgress,
    glowEffect,
    destroy,
  };

  function select(): void {
    if (selected) {
      return;
    }

    selected = true;
    setProgress(0);
    container.setAttribute('aria-pressed', 'true');

    if (!pad.loop) {
      return;
    }

    selection.hidden = false;
    selectionAnimation = animate(
      selection,
      { clipPath: ['circle(0% at 50% 50%)', 'circle(75% at 50% 50%)'] },
      { duration: selectionDurationSeconds, ease: 'linear' },
    );
  }

  function deselect(): void {
    if (!selected) {
      return;
    }

    selected = false;
    progress.reset();

    selection.hidden = true;
    selectionAnimation?.cancel();
    selectionAnimation = undefined;
    selection.style.removeProperty('clip-path');

    container.style.removeProperty('--fx-opacity');
    container.setAttribute('aria-pressed', 'false');
  }

  function setProgress(value: number): void {
    const clamped = Math.max(0, Math.min(1, value));
    progress.setProgress(clamped);
    if (!pad.loop) {
      // Fade toward the inactive background opacity of 20%.
      container.style.setProperty('--fx-opacity', String(Math.min(1, 1.2 - clamped)));
    }
  }

  function destroy(): void {
    glowEffect.destroy();
    selectionAnimation?.cancel();
    container.removeEventListener('pointerup', handlePointerUp);
    container.remove();
  }

  function handlePointerUp(event: PointerEvent): void {
    if (!event.isPrimary || event.button !== 0) {
      return;
    }
    onPress();
  }
}
