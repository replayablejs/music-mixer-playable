import { h } from '#jsx';

import './pad-progress-ring.css';

const segmentCount = 8;

export function createPadProgressRing() {
  const segments = Array.from({ length: segmentCount }, (_, index) => (
    <span class="mixer-ring-segment" style={`--segment:${index}`} />
  ));
  const container = (
    <span class="mixer-pad-ring" aria-hidden="true">
      {segments}
    </span>
  );

  let activeSegmentIndex = -1;

  return { container, setProgress, reset };

  function setProgress(progress: number): void {
    // Wrap to the first dash when the loop reaches its end.
    const index = Math.round(Math.max(0, progress) * segmentCount) % segmentCount;
    if (index === activeSegmentIndex) {
      return;
    }

    reset();
    segments[index].classList.add('active');
    activeSegmentIndex = index;
  }

  function reset(): void {
    if (activeSegmentIndex !== -1) {
      segments[activeSegmentIndex].classList.remove('active');
    }
    activeSegmentIndex = -1;
  }
}
