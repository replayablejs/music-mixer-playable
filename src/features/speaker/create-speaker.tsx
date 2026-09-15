import { h } from '#jsx';

import { createSpeakerPulses } from './create-speaker-pulses';

import './speaker.css';

export function createSpeaker() {
  const container = (
    <div class="speaker" role="img" aria-label="Music speaker">
      <div class="speaker-note speaker-note-single" aria-hidden="true">
        <span class="note-bar" />
        <span class="note-stem note-stem-left" />
        <span class="note-head note-head-left" />
      </div>
      <div class="speaker-note speaker-note-pair" aria-hidden="true">
        <span class="note-bar" />
        <span class="note-stem note-stem-left" />
        <span class="note-stem note-stem-right" />
        <span class="note-head note-head-left" />
        <span class="note-head note-head-right" />
      </div>
    </div>
  );

  const pulses = createSpeakerPulses(container);

  return { container, start: pulses.start, stop: pulses.stop, destroy };

  function destroy(): void {
    pulses.destroy();
    container.remove();
  }
}
