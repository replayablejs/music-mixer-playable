import type { AudioPlayback, PlayableAudio } from '@replayablejs/runtime';

import type { MixerPadDefinition } from '#types/mixer-pad';

import { mixerPads } from '../mixer/config/mixer-pads';
import { getPackSound, soundPack } from './sound-pack';

/** Owns voices only. Selection, progress graphics, and tutorial stay with their features. */
export function createMixerAudio(audio: PlayableAudio) {
  const loopPlaybacks = new Map<string, AudioPlayback>();
  const selectedLoopIds = new Set<string>();

  let fx: { id: string; playback: AudioPlayback } | undefined;
  let stopped = false;

  return { select, deselect, getPlayback, getMainLoop, stop };

  function select(pad: MixerPadDefinition): void {
    if (stopped) {
      return;
    }

    if (!pad.loop) {
      playFx(pad);
      return;
    }

    selectedLoopIds.add(pad.id);
    startLoops();
    loopPlaybacks.get(pad.id)?.setVolume(soundPack.volume);
  }

  function deselect(pad: MixerPadDefinition): void {
    if (!pad.loop) {
      fx?.playback.stop();
      fx = undefined;
      return;
    }

    selectedLoopIds.delete(pad.id);
    loopPlaybacks.get(pad.id)?.setVolume(0);

    if (selectedLoopIds.size === 0) {
      for (const playback of loopPlaybacks.values()) {
        playback.stop();
      }
      loopPlaybacks.clear();
    }
  }

  function getPlayback(id: string): AudioPlayback | undefined {
    return loopPlaybacks.get(id) ?? (fx?.id === id ? fx.playback : undefined);
  }

  function getMainLoop(): AudioPlayback | undefined {
    for (const id of selectedLoopIds) {
      return loopPlaybacks.get(id);
    }
    return undefined;
  }

  function stop(): void {
    stopped = true;
    for (const playback of loopPlaybacks.values()) {
      playback.stop();
    }
    loopPlaybacks.clear();
    selectedLoopIds.clear();

    fx?.playback.stop();
    fx = undefined;
  }

  function startLoops(): void {
    if (selectedLoopIds.size === 0 || loopPlaybacks.size > 0) {
      return;
    }
    // Request the loop bank together; Replayable retains any not yet loaded.
    for (const pad of mixerPads) {
      if (pad.loop) {
        loopPlaybacks.set(pad.id, audio.play(getPackSound(pad.id), { loop: true, volume: 0 }));
      }
    }
    for (const id of selectedLoopIds) {
      loopPlaybacks.get(id)?.setVolume(soundPack.volume);
    }
  }

  function playFx(pad: MixerPadDefinition): void {
    fx?.playback.stop();
    fx = { id: pad.id, playback: audio.play(getPackSound(pad.id), { volume: soundPack.volume }) };
  }
}
