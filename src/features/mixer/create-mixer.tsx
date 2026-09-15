import { playable } from '@replayablejs/runtime';
import type { TweenPlaybackControls } from '@replayablejs/tween';

import { h } from '#jsx';
import type { GameModel } from '#types/game-model';
import type { Mixer } from '#types/mixer';
import type { MixerPad } from '#types/mixer-pad';

import { createMixerAudio } from '../audio/create-mixer-audio';
import { soundPack } from '../audio/sound-pack';
import { animateMixerExpansion } from './animate-mixer-pads';
import { mixerPads } from './config/mixer-pads';
import { createMixerPad } from './pad/create-mixer-pad';

import './mixer.css';

export function createMixer(model: GameModel): Mixer {
  const audio = createMixerAudio(playable.audio);
  const pads: MixerPad[] = mixerPads.map((definition) => ({
    definition,
    view: createMixerPad(definition, () => model.activate(definition.id)),
  }));

  const grid = (
    <div class="mixer" data-mode="compact" aria-label="Music mixer">
      {pads.map((pad) => pad.view.container)}
    </div>
  );
  const container = <div class="mixer-space">{grid}</div>;

  let transitions: TweenPlaybackControls[] = [];
  let expanded = false;
  let loopElapsed = 0;
  let fxPosition = 0;

  const removeSelection = model.onSelectionChange(updateSelection);
  const removeLoopUpdate = playable.update.add(updateProgress);
  const removeResize = playable.on('resize', finishExpansion);

  return {
    container,
    expand,
    setPadGlow,
    getPadElement,
    getLoopTiming,
    deactivate,
    destroy,
  };

  /** CSS owns both layouts. Measurements only animate between their final positions. */
  function expand(animated = true): void {
    if (expanded) {
      return;
    }
    expanded = true;
    if (!animated) {
      grid.dataset.mode = 'expanded';
      for (const pad of pads) {
        pad.view.container.hidden = false;
      }
      return;
    }
    transitions = animateMixerExpansion(
      grid,
      pads.map((pad) => pad.view),
    );
    void Promise.all(transitions.map((animation) => animation.then(() => {}))).then(
      finishExpansion,
    );
  }

  function getPadElement(id: string): HTMLElement | undefined {
    return pads.find((candidate) => candidate.definition.id === id)?.view.container;
  }

  function setPadGlow(id: string, visible: boolean, onPulse?: (intensity: number) => void): void {
    const pad = pads.find((candidate) => candidate.definition.id === id);
    if (visible) {
      pad?.view.glowEffect.show(onPulse);
    } else {
      pad?.view.glowEffect.hide();
    }
  }

  function getLoopTiming(): { position: number; duration: number } | undefined {
    if (!model.hasActiveLoops()) {
      return undefined;
    }
    return playable.config.audio
      ? audio.getMainLoop()
      : { position: loopElapsed, duration: soundPack.loopDuration };
  }

  /** Freeze interaction and visuals while the mix continues through the endcard. */
  function deactivate(): void {
    container.inert = true;
    removeLoopUpdate();
    finishExpansion();
    for (const pad of pads) {
      pad.view.glowEffect.hide();
    }
  }

  function destroy(): void {
    removeLoopUpdate();
    audio.stop();
    removeSelection();
    removeResize();
    for (const animation of transitions) {
      animation.cancel();
    }
    transitions = [];
    for (const pad of pads) {
      pad.view.destroy();
    }
    container.remove();
  }

  function updateSelection({ previous, selected }: { previous?: string; selected?: string }): void {
    const previousPad = pads.find((pad) => pad.definition.id === previous);
    const selectedPad = pads.find((pad) => pad.definition.id === selected);
    if (previousPad) {
      previousPad.view.deselect();
      audio.deselect(previousPad.definition);
    }
    if (selectedPad) {
      audio.select(selectedPad.definition);
      selectedPad.view.select();
      if (!selectedPad.definition.loop) {
        fxPosition = 0;
      }
    }
  }

  function updateProgress({ deltaSeconds }: { deltaSeconds: number }): void {
    if (!playable.config.audio) {
      loopElapsed = model.hasActiveLoops()
        ? (loopElapsed + deltaSeconds) % soundPack.loopDuration
        : 0;
    }
    const timing = getLoopTiming();
    for (const pad of pads.filter((candidate) => model.isSelected(candidate.definition.id))) {
      if (pad.definition.loop) {
        if (timing && timing.duration > 0) {
          pad.view.setProgress(timing.position / timing.duration);
        }
      } else {
        updateFxProgress(pad, deltaSeconds);
      }
    }
  }

  function updateFxProgress(pad: MixerPad, deltaSeconds: number): void {
    const playback = audio.getPlayback(pad.definition.id);
    const duration = playable.config.audio
      ? playback?.duration
      : soundPack.fxDurations[pad.definition.placement.index];
    if (!duration) {
      return;
    }
    const position = playable.config.audio ? (playback?.position ?? 0) : fxPosition + deltaSeconds;
    const finished = position >= duration || (fxPosition > 0 && position === 0);
    fxPosition = position;
    if (finished) {
      model.deselect(pad.definition.id);
    } else {
      pad.view.setProgress(position / duration);
    }
  }

  /** On resize, settle immediately into CSS's current expanded layout. */
  function finishExpansion(): void {
    for (const animation of transitions) {
      animation.complete();
    }
    transitions = [];
    for (const { view } of pads) {
      view.container.style.removeProperty('transform');
      view.container.style.removeProperty('opacity');
    }
  }
}
